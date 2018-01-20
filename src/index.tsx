import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import * as firebase from 'firebase'
import App from './components/App'
import './styles/index.css'
import { firebaseConfig } from './firebaseConfig'

const rrfConfig = {
  userProfile: 'users',
}

firebase.initializeApp(firebaseConfig)

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig),
)(createStore)

const local = (s = {}) => (s)

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  local
})

// Create store with reducers and initial state
const initialState = {local: {'-234csad': {extra: true}}}
const store = createStoreWithFirebase(rootReducer, initialState)
const Root = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)

render(
  <Root/>,
  document.getElementById('root') as HTMLElement
)
