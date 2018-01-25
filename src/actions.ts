import actionCreatorFactory from 'redux-typescript-actions'

const actionCreator = actionCreatorFactory()
export const updateBoxSize = actionCreator<{ id: string, h: number, w: number }>('UPDATE_BOX_SIZE')
// export const removeBox = actionCreator<{ id: string }>('REMOVE_BOX')
