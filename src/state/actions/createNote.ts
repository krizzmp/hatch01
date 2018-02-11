import { takeLatest } from 'redux-saga/effects'
import actionCreatorFactory from 'redux-typescript-actions'
import { Action } from 'redux-typescript-actions'
import { rootId } from 'src/utils'

const actionCreator = actionCreatorFactory()
// let cuid = require('cuid')

type CreateNoteProps = {id: string, x: number, y: number }
export const CreateNote = actionCreator<CreateNoteProps>('CREATE_NOTE')

export function* createNote(firebase: any, action: Action<CreateNoteProps>) {
  const {id, x, y} = action.payload
  console.log(action.payload)
  firebase.set(`${rootId}/todos/${id}`, {
    id, name: 'new note',
    x, y, dx: 0, dy: 0
  })
}
export default (firebase) => takeLatest(CreateNote.type, createNote, firebase)