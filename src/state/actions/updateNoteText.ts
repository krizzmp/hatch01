import { takeEvery } from 'redux-saga/effects'
import { Action } from 'redux-typescript-actions'
import { rootId } from 'src/utils'
import actionCreatorFactory from 'redux-typescript-actions'
const actionCreator = actionCreatorFactory()

type UpdateNoteTextProps = { name: string, id: string }
console.log(actionCreator)
export const UpdateNoteText = actionCreator<UpdateNoteTextProps>('UPDATE_NOTE_TEXT')

export function* updateNoteText(firebase: any, action: Action<UpdateNoteTextProps>) {
  firebase.update(`${rootId}/todos/${action.payload.id}`, {name: action.payload.name})
}
export default (firebase) => takeEvery(UpdateNoteText.type, updateNoteText, firebase)