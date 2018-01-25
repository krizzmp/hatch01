import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer, getFirebase } from 'react-redux-firebase'
import * as firebase from 'firebase'
import App from './components/App'
import './styles/index.css'
import { firebaseConfig } from './firebaseConfig'
import * as _ from 'lodash'
import { updateBoxSize } from './actions'
import { isType } from 'redux-typescript-actions'
import createSagaMiddleware from 'redux-saga'
// import { takeEvery } from 'redux-saga/effects'
import helloSaga from './sagas'

const {whyDidYouUpdate} = require('why-did-you-update')
whyDidYouUpdate(React)

const rrfConfig = {userProfile: 'users'}

firebase.initializeApp(firebaseConfig)

const sagaMiddleware = createSagaMiddleware() // create middleware

const middleware = [sagaMiddleware]
// const createStoreWithFirebase = compose(
//   reactReduxFirebase(firebase, rrfConfig),
//   applyMiddleware(...middleware),
// )(createStore)

const local = (s = {}, action) => {
  if (isType(action, updateBoxSize)) {
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

// when calling saga, pass getFirebase

// Create store with reducers and initial state
const initialState = {}
const store = createStore(
  rootReducer,
  initialState, // initial state
  compose(
    reactReduxFirebase(firebase, rrfConfig),
    applyMiddleware(...middleware)
  )
)

sagaMiddleware.run(helloSaga, getFirebase)
const Root = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)

render(
  <Root/>,
  document.getElementById('root') as HTMLElement
)
