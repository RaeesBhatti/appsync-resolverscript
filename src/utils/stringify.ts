// Derived from this Gist from Andrew Burgess: https://gist.github.com/andrew8088/6f53af9579266d5c62c8
// Permission granted via email, 2019/11/05.

import { VelocityBoolean, VelocityLong, VelocityString } from '../velocity-types'
import { Mapping } from '../ResolverTemplateBuilder'
import { UnitRequestContext } from '../UnitRequestContext'
import { vtl } from '../VelocityFragment'

const renderTab = (indent: number | undefined, depth: number): string =>
  indent !== undefined ? ' '.repeat(indent * depth) : ''
const renderSpace = (indent?: number): string => (indent !== undefined ? ' ' : '')
const renderNewline = (indent: number | undefined, depth: number): string =>
  indent !== undefined ? '\n' + renderTab(indent, depth) : ''

interface JSONSerializableObject {
  [key: string]: unknown
}

interface CustomJSONSerializableObject {
  [key: string]: unknown

  bypassJSON(): string
}

const isCustomJSONSerializableObject = (value: object): value is CustomJSONSerializableObject => 'bypassJSON' in value

/**
 * A version of `JSON.stringify()` that supports a `bypassJSON()` method on an object, similar to `toJSON()` but which
 * provides the raw string that is added to the output. This allows you to generate invalid JSON, which we need in
 * order to produce JSON templates with embedded Velocity variables, functions and directives.
 * @param value the value to stringify.
 * @param indent if defined, pretty-print the JSON using the specified number of spaces. Unlike `JSON.stringify()`, this
 *   doesn't accept a non-numeric value.
 * @param depth the current depth of nesting when traversing through a graph of objects.
 * @param renderedObjects keeps track of objects that have already been stringified, to detect circular references.
 * @param naked
 */
export const stringify = (
  value: unknown,
  indent?: number,
  depth = 0,
  renderedObjects = new WeakSet(),
  naked = false
): string | undefined => {
  switch (typeof value) {
    case 'string':
      return '"' + value.replace(/\\/g, '\\\\').replace('"', '\\"') + '"'
    case 'number':
    case 'boolean':
      return `${value}`
    case 'function':
      return 'null'
    case 'object':
      return stringifyObject(value, indent, depth, renderedObjects, naked)
  }
}

const stringifyObject = (
  object: object | null | undefined,
  indent: number | undefined,
  depth: number,
  renderedObjects: WeakSet<object>,
  naked = false
): string | undefined => {
  if (object === null) {
    return 'null'
  }
  if (object === undefined) {
    return undefined
  }

  if (isCustomJSONSerializableObject(object)) {
    return object.bypassJSON()
  }

  if (renderedObjects.has(object)) {
    throw new TypeError('Converting circular structure to JSON')
  } else {
    renderedObjects.add(object)
  }

  if (object instanceof Date) return '"' + object.toISOString() + '"'
  if (object instanceof Array) {
    return stringifyArray(object, indent, depth, renderedObjects)
  }

  const serializableObject = object as JSONSerializableObject
  let symbolsContent = ''
  for (const symbol of Object.getOwnPropertySymbols(serializableObject)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    symbolsContent += stringify(serializableObject[symbol])
  }
  const attributes = Object.keys(serializableObject)
    .map(k =>
      typeof serializableObject[k] === 'function'
        ? null
        : `${renderNewline(indent, depth + 1)}"${k}":${renderSpace(indent)}${stringify(
          serializableObject[k],
          indent,
          depth + 1,
          renderedObjects
        )}`
    )
    .filter(i => i)
  return `${!naked ? '{' : ''}${symbolsContent ? `\n${symbolsContent}` : ''}${attributes}${renderNewline(
    indent,
    depth
  )}${!naked ? '}' : ''}`
}

const stringifyArray = (
  array: unknown[],
  indent: number | undefined,
  depth: number,
  renderedObjects: WeakSet<object>
): string | undefined => {
  const elements = array.map(
    element => renderNewline(indent, depth + 1) + (stringify(element, indent, depth + 1, renderedObjects) || 'null')
  )
  return `[${elements.join(',')}${renderNewline(indent, depth)}]`
}

export function nullCheck (
  condition: VelocityString | VelocityBoolean | VelocityLong,
  content: Mapping<UnitRequestContext>
): Mapping<UnitRequestContext> {
  return vtl`#if(${stringify(condition)})
    ${stringify(content, undefined, 0, new WeakSet(), true)}
  #end`
}
