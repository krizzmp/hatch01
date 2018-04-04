import { takeEvery } from "redux-saga/effects";
import { Action } from "redux-typescript-actions";
import { actionCreator } from "src/state/actionCreator";

type MoveNoteProps = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  projectId: string;
};
export const MoveNote = actionCreator<MoveNoteProps>("MOVE");

export function* moveNote(firebase: any, action: Action<MoveNoteProps>) {
  const { id, x, y, dx, dy, projectId } = action.payload;
  firebase.update(`${projectId}/todos/${id}`, {
    x: x + dx,
    y: y + dy,
    dx: 0,
    dy: 0
  });
}
export default firebase => takeEvery(MoveNote.type, moveNote, firebase);
