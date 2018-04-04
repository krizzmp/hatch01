import { takeEvery } from "redux-saga/effects";
import { Action } from "redux-typescript-actions";
import { actionCreator } from "src/state/actionCreator";

let cuid = require("cuid");

type ConnectNoteProps = { b1: string; b2: string; projectId: string };
export const ConnectNote = actionCreator<ConnectNoteProps>("CONNECT_NOTE");
export function* connectNote(firebase: any, action: Action<ConnectNoteProps>) {
  let { b1, b2, projectId } = action.payload;
  let newLine = { id: cuid(), b1, b2 };
  firebase.set(`${projectId}/lines/${newLine.id}`, newLine);
  firebase.update(`${projectId}/todos/${b2}`, { dx: 0, dy: 0 });
}
export default firebase => takeEvery(ConnectNote.type, connectNote, firebase);
