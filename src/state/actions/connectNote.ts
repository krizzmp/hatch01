import { takeEvery } from 'redux-saga/effects'
import actionCreatorFactory from 'redux-typescript-actions'
import { Action } from 'redux-typescript-actions'
import { rootId } from 'src/utils'
const actionCreator = actionCreatorFactory()

let cuid = require('cuid')

type ConnectNoteProps = { b1: string, b2: string }
export const ConnectNote = actionCreator<ConnectNoteProps>('CONNECT_NOTE')
export function* connectNote(firebase: any, action: Action<ConnectNoteProps>) {
  let {b1, b2} = action.payload
  let newLine = {id: cuid(), b1, b2}
  firebase.set(`${rootId}/lines/${newLine.id}`, newLine)
  firebase.update(`${rootId}/todos/${b2}`, {dx: 0, dy: 0})
}
export default (firebase) => takeEvery(ConnectNote.type, connectNote, firebase)