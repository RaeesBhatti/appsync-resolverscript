import { VelocityBoolean, VelocityLong, VelocityString } from './velocity-types'
import { Mapping } from './ResolverTemplateBuilder'
import { UnitRequestContext } from './UnitRequestContext'
import { vtl } from './VelocityFragment'
import { stringify } from './utils/stringify'

export function nullCheck (
  condition: VelocityString | VelocityBoolean | VelocityLong,
  content: Mapping<UnitRequestContext>,
  endWithComma = true
): Mapping<UnitRequestContext> {
  return vtl`#if(${stringify(condition)})
    ${stringify(content, undefined, 0, new WeakSet(), true)}${endWithComma ? ',' : ''}
  #end`
}

export function ifElseCondition (
  leftSide: VelocityString | VelocityBoolean | VelocityLong,
  operator: '==' | '||' | '&&',
  rightSide: VelocityString | VelocityBoolean | VelocityLong,
  ifContent: Mapping<UnitRequestContext>,
  elseContent: Mapping<UnitRequestContext>
): Mapping<UnitRequestContext> {
  return vtl`#if(${stringify(leftSide)} ${operator} ${stringify(rightSide)})
    ${stringify(ifContent, undefined, 0, new WeakSet(), true)}
  #else
    ${stringify(elseContent, undefined, 0, new WeakSet(), true)}
  #end`
}
