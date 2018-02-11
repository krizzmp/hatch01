import actionCreatorFactory from 'redux-typescript-actions'
const actionCreator = actionCreatorFactory()

type UpdateNoteSizeProps = { id: string, h: number, w: number }
export const UpdateNoteSize = actionCreator<UpdateNoteSizeProps>('UPDATE_NOTE_SIZE')