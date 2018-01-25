import { select, takeEvery } from 'redux-saga/effects'
// import { removeBox } from './actions'
import * as R from 'ramda'
import actionCreatorFactory from 'redux-typescript-actions'
import { rootId } from './utils'

let cuid = require('cuid')

const actionCreator = actionCreatorFactory()

export const RemoveNote = actionCreator<{ id: string }>('REMOVE_BOX')

function* removeNote(fb: any, action: any) {
  let boxId = action.payload.id
  let lines = yield select(R.path(['firebase', 'data', rootId, 'lines']))
  R.pipe(
    R.filter((line) => line.b1 === boxId || line.b2 === boxId),
    R.forEachObjIndexed(
      (line, id: string) => {
        fb().remove(`${rootId}/lines/${id}`)
      },
    ),
  )(lines)
}

export const ConnectNote = actionCreator<{ b1: string, b2: string }>('CONNECT_NOTE')

function* connectNote(fb: any, action: any) {
  let {b1, b2} = action.payload
  let firebase = fb()
  let newLine = {id: cuid(), b1, b2}
  firebase.set(`${rootId}/lines/${newLine.id}`, newLine)
  firebase.update(`${rootId}/todos/${b2}`, {dx: 0, dy: 0})

}

export const DisConnectLine = actionCreator<{ lineId: string, noteId: string }>('DISCONNECT_NOTE')

function* disConnectLine(fb: any, action: any) {
  let {lineId, noteId} = action.payload
  let firebase = fb()
  firebase.remove(`${rootId}/lines/${lineId}`)
  firebase.update(`${rootId}/todos/${noteId}`, {
    dx: 0, dy: 0,
  })
}

export default function* helloSaga(getFirebase: () => any) {
  yield takeEvery(RemoveNote.type, removeNote, getFirebase)
  yield takeEvery(ConnectNote.type, connectNote, getFirebase)
  yield takeEvery(DisConnectLine.type, disConnectLine, getFirebase)
}