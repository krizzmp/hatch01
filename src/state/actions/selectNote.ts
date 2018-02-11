import actionCreatorFactory from 'redux-typescript-actions'

const actionCreator = actionCreatorFactory()
// let cuid = require('cuid')

type SelectNoteProps = {id: string }
export const SelectNote = actionCreator<SelectNoteProps>('SELECT_NOTE')
