/**
 * Rule: no-multiple-resolved
 * Disallow creating new promises with paths that resolve multiple times
 */

'use strict'

const getDocsUrl = require('./lib/get-docs-url')
const {
  isPromiseConstructorWithInlineExecutor,
} = require('./lib/is-promise-constructor')

/**
 * @typedef {import('estree').Node} Node
 * @typedef {import('estree').Identifier} Identifier
 * @typedef {import('estree').FunctionExpression} FunctionExpression
 * @typedef {import('estree').ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {import('estree').SimpleCallExpression} CallExpression
 * @typedef {import('eslint').Rule.CodePath} CodePath
 * @typedef {import('eslint').Rule.CodePathSegment} CodePathSegment
 */

/**
 * Iterate all previous path segments.
 * @param {CodePathSegment} segment
 * @returns {Iterable<CodePathSegment[]>}
 */
function* iterateAllPrevPathSegments(segment) {
  yield* iterate(segment, [])

  /**
   * @param {CodePathSegment} segment
   * @param {CodePathSegment[]} processed
   */
  function* iterate(segment, processed) {
    if (processed.includes(segment)) {
      return
    }
    const nextProcessed = [segment, ...processed]

    for (const prev of segment.prevSegments) {
      if (prev.prevSegments.length === 0) {
        yield [prev]
      } else {
        for (const segments of iterate(prev, nextProcessed)) {
          yield [prev, ...segments]
        }
      }
    }
  }
}
/**
 * Iterate all next path segments.
 * @param {CodePathSegment} segment
 * @returns {Iterable<CodePathSegment[]>}
 */
function* iterateAllNextPathSegments(segment) {
  yield* iterate(segment, [])

  /**
   * @param {CodePathSegment} segment
   * @param {CodePathSegment[]} processed
   */
  function* iterate(segment, processed) {
    if (processed.includes(segment)) {
      return
    }
    const nextProcessed = [segment, ...processed]

    for (const next of segment.nextSegments) {
      if (next.nextSegments.length === 0) {
        yield [next]
      } else {
        for (const segments of iterate(next, nextProcessed)) {
          yield [next, ...segments]
        }
      }
    }
  }
}

/**
 * Finds the same route path from the given path following previous path segments.
 * @param {CodePathSegment} segment
 * @returns {CodePathSegment | null}
 */
function findSameRoutePathSegment(segment) {
  /** @type {Set<CodePathSegment>} */
  const routeSegments = new Set()
  for (const route of iterateAllPrevPathSegments(segment)) {
    if (routeSegments.size === 0) {
      // First
      for (const seg of route) {
        routeSegments.add(seg)
      }
      continue
    }
    for (const seg of routeSegments) {
      if (!route.includes(seg)) {
        routeSegments.delete(seg)
      }
    }
  }

  for (const routeSegment of routeSegments) {
    let hasUnreached = false
    for (const segments of iterateAllNextPathSegments(routeSegment)) {
      if (!segments.includes(segment)) {
        // It has a route that does not reach the given path.
        hasUnreached = true
        break
      }
    }
    if (!hasUnreached) {
      return routeSegment
    }
  }
  return null
}

class CodePathInfo {
  /**
   * @param {CodePath} path
   */
  constructor(path) {
    this.path = path
    /** @type {Map<CodePathSegment, CodePathSegmentInfo>} */
    this.segmentInfos = new Map()
    this.resolvedCount = 0
    /** @type {CodePathSegment[]} */
    this.allSegments = []
  }

  getCurrentSegmentInfos() {
    return this.path.currentSegments.map((segment) => {
      const info = this.segmentInfos.get(segment)
      if (info) {
        return info
      }
      const newInfo = new CodePathSegmentInfo(this, segment)
      this.segmentInfos.set(segment, newInfo)
      return newInfo
    })
  }
  /**
   * @typedef {object} AlreadyResolvedData
   * @property {Identifier} resolved
   * @property {'certain' | 'potential'} kind
   */

  /**
   * Check all paths and return paths resolved multiple times.
   * @returns {Iterable<AlreadyResolvedData & { node: Identifier }>}
   */
  *iterateReports() {
    const targets = [...this.segmentInfos.values()].filter(
      (info) => info.resolved
    )
    for (const segmentInfo of targets) {
      const result = this._getAlreadyResolvedData(segmentInfo.segment)
      if (result) {
        yield {
          node: segmentInfo.resolved,
          resolved: result.resolved,
          kind: result.kind,
        }
      }
    }
  }
  /**
   * Compute the previously resolved path.
   * @param {CodePathSegment} segment
   * @returns {AlreadyResolvedData | null}
   */
  _getAlreadyResolvedData(segment) {
    if (segment.prevSegments.length === 0) {
      return null
    }
    const prevSegmentInfos = segment.prevSegments.map((prev) =>
      this._getProcessedSegmentInfo(prev)
    )
    if (prevSegmentInfos.every((info) => info.resolved)) {
      // If the previous paths are all resolved, the next path is also resolved.
      return {
        resolved: prevSegmentInfos[0].resolved,
        kind: 'certain',
      }
    }

    for (const prevSegmentInfo of prevSegmentInfos) {
      if (prevSegmentInfo.resolved) {
        // If the previous path is partially resolved,
        // then the next path is potentially resolved.
        return {
          resolved: prevSegmentInfo.resolved,
          kind: 'potential',
        }
      }
      if (prevSegmentInfo.potentiallyResolved) {
        let potential = false
        if (prevSegmentInfo.segment.nextSegments.length === 1) {
          // If the previous path is potentially resolved and there is one next path,
          // then the next path is potentially resolved.
          potential = true
        } else {
          // This is necessary, for example, if `resolve()` in the finally section.
          const segmentInfo = this.segmentInfos.get(segment)
          if (segmentInfo && segmentInfo.resolved) {
            if (
              prevSegmentInfo.segment.nextSegments.every((next) => {
                const nextSegmentInfo = this.segmentInfos.get(next)
                return (
                  nextSegmentInfo &&
                  nextSegmentInfo.resolved === segmentInfo.resolved
                )
              })
            ) {
              // If the previous path is potentially resolved and
              // the next paths all point to the same resolved node,
              // then the next path is potentially resolved.
              potential = true
            }
          }
        }

        if (potential) {
          return {
            resolved: prevSegmentInfo.potentiallyResolved,
            kind: 'potential',
          }
        }
      }
    }

    const sameRoute = findSameRoutePathSegment(segment)
    if (sameRoute) {
      const sameRouteSegmentInfo = this._getProcessedSegmentInfo(sameRoute)
      if (sameRouteSegmentInfo.potentiallyResolved) {
        return {
          resolved: sameRouteSegmentInfo.potentiallyResolved,
          kind: 'potential',
        }
      }
    }
    return null
  }
  /**
   * @param {CodePathSegment} segment
   */
  _getProcessedSegmentInfo(segment) {
    const segmentInfo = this.segmentInfos.get(segment)
    if (segmentInfo) {
      return segmentInfo
    }
    const newInfo = new CodePathSegmentInfo(this, segment)
    this.segmentInfos.set(segment, newInfo)

    const alreadyResolvedData = this._getAlreadyResolvedData(segment)
    if (alreadyResolvedData) {
      if (alreadyResolvedData.kind === 'certain') {
        newInfo.resolved = alreadyResolvedData.resolved
      } else {
        newInfo.potentiallyResolved = alreadyResolvedData.resolved
      }
    }
    return newInfo
  }
}

class CodePathSegmentInfo {
  /**
   * @param {CodePathInfo} pathInfo
   * @param {CodePathSegment} segment
   */
  constructor(pathInfo, segment) {
    this.pathInfo = pathInfo
    this.segment = segment
    /** @type {Identifier | null} */
    this._resolved = null
    /** @type {Identifier | null} */
    this.potentiallyResolved = null
  }

  get resolved() {
    return this._resolved
  }
  /** @type {Identifier} */
  set resolved(identifier) {
    this._resolved = identifier
    this.pathInfo.resolvedCount++
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: getDocsUrl('no-multiple-resolved'),
    },
    messages: {
      alreadyResolved:
        'Promise should not be resolved multiple times. Promise is already resolved on line {{line}}.',
      potentiallyAlreadyResolved:
        'Promise should not be resolved multiple times. Promise is potentially resolved on line {{line}}.',
    },
    schema: [],
  },
  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    const reported = new Set()
    /**
     * @param {Identifier} node
     * @param {Identifier} resolved
     * @param {'certain' | 'potential'} kind
     */
    function report(node, resolved, kind) {
      if (reported.has(node)) {
        return
      }
      reported.add(node)
      context.report({
        node: node.parent,
        messageId:
          kind === 'certain' ? 'alreadyResolved' : 'potentiallyAlreadyResolved',
        data: {
          line: resolved.loc.start.line,
        },
      })
    }
    /** @param {CodePathInfo} codePathInfo */
    function verifyMultipleResolvedPath(codePathInfo) {
      for (const { node, resolved, kind } of codePathInfo.iterateReports()) {
        report(node, resolved, kind)
      }
    }

    /** @type {CodePathInfo[]} */
    const codePathInfoStack = []
    /** @type {Set<Identifier>[]} */
    const resolverReferencesStack = [new Set()]
    return {
      /** @param {FunctionExpression | ArrowFunctionExpression} node */
      'FunctionExpression, ArrowFunctionExpression'(node) {
        if (!isPromiseConstructorWithInlineExecutor(node.parent)) {
          return
        }
        // Collect and stack `resolve` and `reject` references.
        /** @type {Set<Identifier>} */
        const resolverReferences = new Set()
        const resolvers = node.params.filter(
          /** @returns {node is Identifier} */
          (node) => node && node.type === 'Identifier'
        )
        for (const resolver of resolvers) {
          const variable = context.getScope().set.get(resolver.name)
          // istanbul ignore next -- Usually always present.
          if (!variable) continue
          for (const reference of variable.references) {
            resolverReferences.add(reference.identifier)
          }
        }

        resolverReferencesStack.unshift(resolverReferences)
      },
      /** @param {FunctionExpression | ArrowFunctionExpression} node */
      'FunctionExpression, ArrowFunctionExpression:exit'(node) {
        if (!isPromiseConstructorWithInlineExecutor(node.parent)) {
          return
        }
        resolverReferencesStack.shift()
      },
      /** @param {CodePath} path */
      onCodePathStart(path) {
        codePathInfoStack.unshift(new CodePathInfo(path))
      },
      onCodePathEnd() {
        const codePathInfo = codePathInfoStack.shift()
        if (codePathInfo.resolvedCount > 1) {
          verifyMultipleResolvedPath(codePathInfo)
        }
      },
      /** @type {Identifier} */
      'CallExpression > Identifier.callee'(node) {
        const codePathInfo = codePathInfoStack[0]
        const resolverReferences = resolverReferencesStack[0]
        if (!resolverReferences.has(node)) {
          return
        }
        for (const segmentInfo of codePathInfo.getCurrentSegmentInfos()) {
          // If a resolving path is found, report if the path is already resolved.
          // Store the information if it is not already resolved.
          if (segmentInfo.resolved) {
            report(node, segmentInfo.resolved, 'certain')
            continue
          }
          segmentInfo.resolved = node
        }
      },
    }
  },
}
