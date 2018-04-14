import { takeEvery } from "redux-saga/effects";
import { Action } from "redux-typescript-actions";
import { actionCreator } from "src/state/actionCreator";

type MoveDeltaProps = { dx: number; dy: number; id: string; projectId: string };
export const MoveDelta = actionCreator<MoveDeltaProps>("MOVE_DELTA");

export function moveDelta(firebase: any, action: Action<MoveDeltaProps>) {
  const { id, dx, dy, projectId } = action.payload;
  firebase.update(`${projectId}/todos/${id}`, { dx, dy });
}
export default (firebase: any) =>
  takeEvery(MoveDelta.type, moveDelta, firebase);
