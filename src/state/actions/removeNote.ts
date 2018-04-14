import { select, takeEvery } from "redux-saga/effects";
import { Action } from "redux-typescript-actions";
import { actionCreator } from "src/state/actionCreator";
import { LineType } from "src/types";
import * as R from "ramda";

type RemoveNoteProps = { id: string; projectId: string };
export const RemoveNote = actionCreator<RemoveNoteProps>("REMOVE_BOX");
export function* removeNote(firebase: any, action: Action<RemoveNoteProps>) {
  let noteId = action.payload.id;
  let lines: { [id: string]: LineType } = yield select(
    R.path(["firebase", "data", action.payload.projectId, "lines"])
  );
  R.pipe(
    R.filter((line: LineType) => line.b1 === noteId || line.b2 === noteId),
    R.forEachObjIndexed((line, id: string) => {
      firebase.remove(`${action.payload.projectId}/lines/${id}`);
    })
  )(lines);
  firebase.remove(`${action.payload.projectId}/todos/${noteId}`);
}
export default (firebase: any) =>
  takeEvery(RemoveNote.type, removeNote, firebase);
