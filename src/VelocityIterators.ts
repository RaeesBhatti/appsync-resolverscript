import { AppSyncUtil } from './AppSyncUtil'
import { UnitResponseContext } from './UnitResponseContext'
import { createVelocityMap } from './VelocityMap'
import { vtl } from './VelocityFragment'
import { stringify } from './utils/stringify'

type Mapper<C, U, R, DatabaseItemModel> = (context: C, util: U, item: DatabaseItemModel) => R

export function resultItemsForEach<T, DatabaseItemModel = Record<string, any>> (
  context: UnitResponseContext,
  util: AppSyncUtil,
  mapper: Mapper<typeof context, typeof util, T, DatabaseItemModel>
) {
  return vtl`[
  #foreach($item in $ctx.result.items)
    ${stringify(mapper(context, util, (createVelocityMap('item') as unknown) as DatabaseItemModel), 1, 2)}
  #if ($foreach.hasNext),#end
  #end
  ]`
}
