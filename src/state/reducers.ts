import firebase from "@firebase/app";
import "@firebase/database";
import "@firebase/auth";
import { isType } from "redux-typescript-actions";
import {
  firebaseReducer,
  getFirebase,
  reactReduxFirebase
} from "react-redux-firebase";
import createSagaMiddleware from "redux-saga";
import {
  CreateNote,
  SelectNote,
  UpdateNoteText,
  UpdateNoteSize
} from "src/state/actions";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { firebaseConfig } from "src/firebaseConfig";
import helloSaga from "src/state/sagas";
import * as R from "ramda";

const rrfConfig = { userProfile: "users" };

firebase.initializeApp(firebaseConfig);

const sagaMiddleware = createSagaMiddleware(); // create middleware

const middleware = [sagaMiddleware];

export type LocalNote = {
  w: number;
  h: number;
  isNew: boolean;
};
type localStateType = {
  [id: string]: LocalNote;
};
const local = (s: localStateType = {}, action: any) => {
  if (isType(action, UpdateNoteSize)) {
    return R.mergeDeepRight(s, {
      [action.payload.id]: {
        w: action.payload.w,
        h: action.payload.h
      }
    });
  }
  if (isType(action, CreateNote)) {
    return R.mergeDeepRight(s, {
      [action.payload.id]: {
        isNew: true
      }
    });
  }
  if (isType(action, UpdateNoteText)) {
    return R.mergeDeepRight(s, {
      [action.payload.id]: {
        isNew: false
      }
    });
  }
  return s;
};
type canvasState = {
  selected: boolean;
};
const canvas = (s = { selected: "" }, action: any) => {
  if (isType(action, CreateNote)) {
    return {
      selected: action.payload.id
    };
  }
  if (isType(action, SelectNote)) {
    return {
      selected: action.payload.id
    };
  }
  return s;
};
export type RootState = {
  local: localStateType;
  firebase: { auth: { uid: string }; profile: any };
  canvas: canvasState;
};
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  local,
  canvas
});

const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase, rrfConfig),
    applyMiddleware(...middleware)
  )
);

sagaMiddleware.run(helloSaga, getFirebase);
export default store;
