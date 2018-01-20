import * as _ from 'lodash'
import { getVal } from 'react-redux-firebase'

export const toList = (obj) => _(obj)
  .toPairs()
  .map(([key, val]) => ({...val, id: key}))
  .value()

export const mergeToList = (obj1, obj2, d) => {

  return _(obj1)
    .toPairs()
    .map(([key, val]) => ({...val, ..._.defaultTo(obj2[key], d), id: key}))
    .value()
}

export const fbPathToList = (fb, path: string) => toList(getVal(fb, path, {}))
export const fbMergeToList = (fb, path: string, local, d) => {
  return mergeToList(
    getVal(fb, path, {}),
    local,
    d
  )
}
