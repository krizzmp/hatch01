import * as _ from "lodash";

import { firebaseConnect, getVal } from "react-redux-firebase";
import { connect } from "react-redux";
import { RootState } from "src/state/reducers";

export const toList = (obj: {}) =>
  _(obj)
    .toPairs()
    .map(([key, val]) => ({ ...val, id: key }))
    .value();

export const mergeToList = (obj1: {}, obj2: {}, d: {}) => {
  return _(obj1)
    .toPairs()
    .map(([key, val]) => ({ ...val, ..._.defaultTo(obj2[key], d), id: key }))
    .value();
};

export const fbPathToList = (fb: any, path: string) =>
  toList(getVal(fb, path, {}));
export const fbMergeToList = (fb: any, path: string, local: any, d: any) => {
  return mergeToList(getVal(fb, path, {}), local, d);
};

// export const rootId = 'quatasd'

// export const withRoot = (str: string) => rootId + '/' + str

const en1 = (
  getProjectId: (props: any) => string,
  paths: Array<string>,
  mapStateToProps: (state: RootState, firebase: any) => { [prop: string]: any },
  mapActionsToProps: (dispatch: any) => { [prop: string]: any }
) => (App: React.ComponentType<any>) =>
  firebaseConnect((props: any) =>
    paths.map(path => getProjectId(props) + "/" + path)
  )(
    connect(
      (state: RootState, props) =>
        mapStateToProps(state, (path: string) =>
          getVal(state.firebase, `data/${getProjectId(props)}/${path}`, {})
        ),
      mapActionsToProps
    )(App)
  );
export const fbConnect = en1;
