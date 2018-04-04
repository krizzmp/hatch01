import { actionCreator } from "src/state/actionCreator";

type SelectNoteProps = { id: string };
export const SelectNote = actionCreator<SelectNoteProps>("SELECT_NOTE");
