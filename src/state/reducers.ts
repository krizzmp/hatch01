import * as firebase from 'firebase'
import { isType } from 'redux-typescript-actions'
import { firebaseReducer, getFirebase, reactReduxFirebase } from 'react-redux-firebase'
import createSagaMiddleware from 'redux-saga'
import {
  CreateNote, SelectNote,
  UpdateNoteText,
} from 'src/state/actions'
import { UpdateNoteSize } from './actions/index'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { firebaseConfig } from '../firebaseConfig'
import helloSaga from './sagas'
import * as R from 'ramda'

const rrfConfig = {userProfile: 'users'}

firebase.initializeApp(firebaseConfig)

const sagaMiddleware = createSagaMiddleware() // create middleware

const middleware = [sagaMiddleware]

export type LocalNote = {
  w: number,
  h: number,
  isNew: boolean
}
type localStateType = {
  [id: string]: LocalNote
}
const local = (s: localStateType = {}, action) => {
  if (isType(action, UpdateNoteSize)) {
    return R.mergeDeepRight(s, {
      [action.payload.id]: {
        w: action.payload.w,
        h: action.payload.h,
      }
    })
  }
  if (isType(action, CreateNote)) {
    return R.mergeDeepRight(s, {
      [action.payload.id]: {
        isNew: true
      }
    })
  }
  if (isType(action, UpdateNoteText)) {
    return R.mergeDeepRight(s, {
      [action.payload.id]: {
        isNew: false
      }
    })
  }
  return s
}
const canvas = (s = {selected: ''}, action) => {
  if (isType(action, CreateNote)) {
    return {
      selected: action.payload.id
    }
  }
  if (isType(action, SelectNote)) {
    return {
      selected: action.payload.id
    }
  }
  return s
}
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  local,
  canvas
})

const initialState = {}
const store = createStore(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase, rrfConfig),
    applyMiddleware(...middleware)
  )
)

sagaMiddleware.run(helloSaga, getFirebase)
export default store