import { takeEvery } from 'redux-saga/effects'
import actionCreatorFactory from 'redux-typescript-actions'
import { Action } from 'redux-typescript-actions'
import { rootId } from 'src/utils'
const actionCreator = actionCreatorFactory()

type MoveDeltaProps = { dx: number, dy: number, id: string }
export const MoveDelta = actionCreator<MoveDeltaProps>('MOVE_DELTA')

export function* moveDelta(firebase: any, action: Action<MoveDeltaProps>) {
  const {id, dx, dy} = action.payload
  firebase.update(`${rootId}/todos/${id}`, {dx, dy})
}
export default (firebase) => takeEvery(MoveDelta.type, moveDelta, firebase)