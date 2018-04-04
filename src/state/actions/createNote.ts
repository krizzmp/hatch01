import { takeLatest } from "redux-saga/effects";
import { Action } from "redux-typescript-actions";
import { actionCreator } from "src/state/actionCreator";

type CreateNoteProps = { id: string; x: number; y: number; projectId: string };
export const CreateNote = actionCreator<CreateNoteProps>("CREATE_NOTE");

export function* createNote(firebase: any, action: Action<CreateNoteProps>) {
  const { id, x, y, projectId } = action.payload;
  console.log(action.payload);
  firebase.set(`${projectId}/todos/${id}`, {
    id,
    name: "new note",
    x,
    y,
    dx: 0,
    dy: 0
  });
}
export default firebase => takeLatest(CreateNote.type, createNote, firebase);
