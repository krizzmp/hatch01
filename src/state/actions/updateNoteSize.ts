import { actionCreator } from "src/state/actionCreator";

type UpdateNoteSizeProps = { id: string; h: number; w: number };
export const UpdateNoteSize = actionCreator<UpdateNoteSizeProps>(
  "UPDATE_NOTE_SIZE"
);
