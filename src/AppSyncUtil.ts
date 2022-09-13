import { stringify } from './utils/stringify'
import { vtl, VelocityFragment } from './VelocityFragment'
import { DynamoDB } from './DynamoDB'
import { VelocityBoolean, VelocityLong, VelocityObject, VelocityString, VoidType } from './velocity-types'

export class AppSyncUtil {
  dynamodb = new DynamoDB()

  str = new Str()

  time = new Time()

  isList = (value: VelocityObject): VelocityFragment<boolean> => vtl`$util.isList(${stringify(value)})`

  isString = (value: VelocityObject): VelocityFragment<boolean> => vtl`$util.isString(${stringify(value)})`

  isNull = (value: VelocityObject): VelocityFragment<boolean> => vtl`$util.isNull(${stringify(value)})`

  isNullOrEmpty = (value: VelocityString): VelocityFragment<boolean> => vtl`$util.isNullOrEmpty(${stringify(value)})`

  defaultIfNull = (value: VelocityObject, defaultValue: VelocityObject): VelocityObject =>
    vtl`$util.defaultIfNull(${stringify(value)}, ${stringify(defaultValue)})`

  unauthorized = (): VelocityFragment<VoidType> => vtl`$util.unauthorized()`

  toJson = (value: VelocityObject | VelocityLong | VelocityBoolean): VelocityFragment<string> =>
    vtl`$util.toJson(${stringify(value)})`
}

export class Time {
  nowISO8601 = (): VelocityFragment => vtl`$util.time.nowISO8601()`
  nowEpochSeconds = (): VelocityFragment => vtl`$util.time.nowEpochSeconds()`
  nowEpochMilliSeconds = (): VelocityFragment => vtl`$util.time.nowEpochMilliSeconds()`
  nowFormatted = (str: VelocityString): VelocityFragment => vtl`$util.time.nowFormatted(${stringify(str)})`
  nowFormattedWithTimeZone = (fmt: VelocityString, timeZone: VelocityString): VelocityFragment =>
    vtl`$util.time.nowFormatted(${stringify(fmt)}, ${stringify(timeZone)})`

  parseFormattedToEpochMilliSeconds = (time: VelocityString, fmt: VelocityString): VelocityFragment =>
    vtl`$util.time.parseFormattedToEpochMilliSeconds(${stringify(time)}, ${stringify(fmt)})`

  parseFormattedToEpochMilliSecondsWithTimezone = (
    time: VelocityString,
    fmt: VelocityString,
    timeZone: VelocityString
  ): VelocityFragment =>
    vtl`$util.time.parseFormattedToEpochMilliSeconds(${stringify(time)}, ${stringify(fmt)}, ${stringify(timeZone)})`

  parseISO8601ToEpochMilliSeconds = (time: VelocityString): VelocityFragment =>
    vtl`$util.time.parseISO8601ToEpochMilliSeconds(${stringify(time)})`

  epochMilliSecondsToSeconds = (time: VelocityLong): VelocityFragment =>
    vtl`$util.time.epochMilliSecondsToSeconds(${stringify(time)})`

  epochMilliSecondsToISO8601 = (time: VelocityLong): VelocityFragment =>
    vtl`$util.time.epochMilliSecondsToISO8601(${stringify(time)})`

  epochMilliSecondsToFormatted = (time: VelocityLong, fmt: VelocityString): VelocityFragment =>
    vtl`$util.time.epochMilliSecondsToFormatted(${stringify(time)}, ${stringify(fmt)})`

  epochMilliSecondsToFormattedWithTimezone = (
    time: VelocityLong,
    fmt: VelocityString,
    timezone: VelocityString
  ): VelocityFragment =>
    vtl`$util.time.epochMilliSecondsToFormatted(${stringify(time)}, ${stringify(fmt)}, ${stringify(timezone)})`
}

export class Str {
  toUpper = (value: VelocityString): VelocityFragment => vtl`$util.str.toUpper(${stringify(value)})`
  toLower = (value: VelocityString): VelocityFragment => vtl`$util.str.toLower(${stringify(value)})`
  toReplace = (str: VelocityString, search: VelocityString, replace: VelocityString): VelocityFragment =>
    vtl`$util.str.toReplace(${stringify(str)}, ${stringify(search)}, ${stringify(replace)})`

  normalize = (str: VelocityString, form: 'nfc' | 'nfd' | 'nfkc' | 'nfkd'): VelocityFragment =>
    vtl`$util.str.normalize(${stringify(str)}, ${stringify(form)})`
}
