import { ResolverTemplateBuilder, Mapping } from './ResolverTemplateBuilder'
import { AppSyncVelocityContext } from './AppSyncVelocityContext'
import { UnitRequestContext } from './UnitRequestContext'
import { UnitResponseContext } from './UnitResponseContext'
import * as dynamodb from './operations/dynamodb'

export { stringify } from './utils/stringify'
export { VelocityFragment, vtl } from './VelocityFragment'
export { ResolverTemplate, ResolverTemplateBuilder } from './ResolverTemplateBuilder'
export { PulumiResolver } from './PulumiResolver'

export const operations = {
  dynamodb
}

export const sendAppSyncRequest = (
  request: Mapping<AppSyncVelocityContext<UnitRequestContext>>
): ResolverTemplateBuilder<AppSyncVelocityContext<UnitRequestContext>, AppSyncVelocityContext<UnitResponseContext>> => {
  return new ResolverTemplateBuilder(
    new AppSyncVelocityContext(new UnitRequestContext()),
    new AppSyncVelocityContext(new UnitResponseContext())
  ).sendRequest(request)
}

// export const sendPipelineRequest
