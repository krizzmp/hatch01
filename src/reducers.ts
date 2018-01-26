import * as firebase from 'firebase'
import { isType } from 'redux-typescript-actions'
import { firebaseReducer, getFirebase, reactReduxFirebase } from 'react-redux-firebase'
import createSagaMiddleware from 'redux-saga'
import { UpdateNoteSize } from './sagas'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { firebaseConfig } from './firebaseConfig'
import helloSaga from './sagas'
import * as _ from 'lodash'

const rrfConfig = {userProfile: 'users'}

firebase.initializeApp(firebaseConfig)

const sagaMiddleware = createSagaMiddleware() // create middleware

const middleware = [sagaMiddleware]
const local = (s = {}, action) => {
  if (isType(action, UpdateNoteSize)) {
    return _.merge(s, {
      [action.payload.id]: {
        w: action.payload.w,
        h: action.payload.h,
      }
    })
  }
  return s
}

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  local
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