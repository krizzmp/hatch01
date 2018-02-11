import { takeEvery } from 'redux-saga/effects'
import actionCreatorFactory from 'redux-typescript-actions'
import { Action } from 'redux-typescript-actions'
import { rootId } from 'src/utils'
const actionCreator = actionCreatorFactory()

type DisconnectLineProps = { lineId: string, noteId: string }
export const DisconnectLine = actionCreator<DisconnectLineProps>('DISCONNECT_NOTE')
export function* disconnectLine(firebase: any, action: Action<DisconnectLineProps>) {
  let {lineId, noteId} = action.payload
  firebase.remove(`${rootId}/lines/${lineId}`)
  firebase.update(`${rootId}/todos/${noteId}`, {
    dx: 0, dy: 0,
  })
}
export default (firebase) => takeEvery(DisconnectLine.type, disconnectLine, firebase)