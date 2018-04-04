import { takeEvery } from "redux-saga/effects";
import { Action } from "redux-typescript-actions";
import { actionCreator } from "src/state/actionCreator";

type DisconnectLineProps = {
  lineId: string;
  noteId: string;
  projectId: string;
};
export const DisconnectLine = actionCreator<DisconnectLineProps>(
  "DISCONNECT_NOTE"
);
export function* disconnectLine(
  firebase: any,
  action: Action<DisconnectLineProps>
) {
  let { lineId, noteId, projectId } = action.payload;
  firebase.remove(`${projectId}/lines/${lineId}`);
  firebase.update(`${projectId}/todos/${noteId}`, {
    dx: 0,
    dy: 0
  });
}
export default firebase =>
  takeEvery(DisconnectLine.type, disconnectLine, firebase);
