import { select, takeEvery } from 'redux-saga/effects'
import actionCreatorFactory from 'redux-typescript-actions'
import { Action } from 'redux-typescript-actions'
import { LineType } from 'src/types'
import { rootId } from 'src/utils'
import * as R from 'ramda'
const actionCreator = actionCreatorFactory()

type RemoveNoteProps = { id: string }
export const RemoveNote = actionCreator<RemoveNoteProps>('REMOVE_BOX')
export function* removeNote(firebase: any, action: Action<RemoveNoteProps>) {
  let noteId = action.payload.id
  let lines: {[id: string]: LineType} = yield select(R.path(['firebase', 'data', rootId, 'lines']))
  R.pipe(
    R.filter((line: LineType) => line.b1 === noteId || line.b2 === noteId),
    R.forEachObjIndexed(
      (line, id: string) => {
        firebase.remove(`${rootId}/lines/${id}`)
      },
    ),
  )(lines)
  firebase.remove(`${rootId}/todos/${noteId}`)
}
export default (firebase) => takeEvery(RemoveNote.type, removeNote, firebase)