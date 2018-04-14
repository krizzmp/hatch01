import { takeEvery } from "redux-saga/effects";
import { Action } from "redux-typescript-actions";
import { actionCreator } from "src/state/actionCreator";

type UpdateNoteTextProps = { name: string; id: string; projectId: string };
export const UpdateNoteText = actionCreator<UpdateNoteTextProps>(
  "UPDATE_NOTE_TEXT"
);

export function updateNoteText(
  firebase: any,
  action: Action<UpdateNoteTextProps>
) {
  firebase.update(`${action.payload.projectId}/todos/${action.payload.id}`, {
    name: action.payload.name
  });
}
export default (firebase: any) =>
  takeEvery(UpdateNoteText.type, updateNoteText, firebase);
