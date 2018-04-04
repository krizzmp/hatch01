import ConnectNote from "src/state/actions/connectNote";
import CreateNote from "src/state/actions/createNote";
import DisconnectLine from "src/state/actions/disconnectLine";
import MoveDelta from "src/state/actions/moveDelta";
import MoveNote from "src/state/actions/moveNote";
import UpdateNoteText from "src/state/actions/updateNoteText";
import RemoveNote from "src/state/actions/removeNote";

export default function* helloSaga(getFirebase: () => any) {
  let firebase = getFirebase();
  yield RemoveNote(firebase);
  yield ConnectNote(firebase);
  yield DisconnectLine(firebase);
  yield UpdateNoteText(firebase);
  yield CreateNote(firebase);
  yield MoveDelta(firebase);
  yield MoveNote(firebase);
}
