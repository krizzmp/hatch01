import * as React from "react";
import { connect } from "react-redux";
import { getVal } from "react-redux-firebase";
import { RootState } from "src/state/reducers";
import { Link, withRouter } from "react-router-dom";
// import { compose } from "redux";

// function createFirebaseConnect<
//   P extends Object,
//   S extends Object,
//   N extends Object
// >(
//   _fbConnFn: (props: P) => any[],
//   connFn: (state: S, props: P) => N
// ): React.ComponentType<{ children: (props: P & N) => JSX.Element }> {
//   const ggg = compose(firebaseConnect(_fbConnFn), connect(connFn));
//   const Hhh = ({
//     children,
//     ...props
//   }: any & {
//     children: (props: P & N) => JSX.Element;
//   }) => children(props);
//   return ggg(Hhh) as React.ComponentType<{
//     children: (props: P & N) => JSX.Element;
//   }>;
// }

function createConnect<P extends Object, S extends Object, N extends Object>(
  connFn: (state: S, props: P) => N,
): React.ComponentType<{ children: (props: P & N) => JSX.Element }> {
  const ggg = connect(connFn);
  const Hhh = ({ children, ...props }: any) => {
    let P = withRouter(children);
    return <P {...props} />;
  };
  return (ggg(Hhh) as any) as React.ComponentType<{
    children: (props: P & N) => JSX.Element;
  }>;
}

let F = createConnect(({ firebase }: RootState, props: {}) => ({
  auth: firebase.auth,
  profile: firebase.profile,
  user: getVal(firebase, `users/${firebase.auth.uid}`, {}), // lodash's get can also be used
}));
const Documents = () => {
  return (
    <div>
      <F>
        {(p) => {
          console.log(p);

          return p.profile.isLoaded && !p.profile.isEmpty ? (
            <div>
              {p.profile.displayName}

              {Object.keys(p.profile.documents).map((id) => (
                <Link key={id} to={`/${id}`}>
                  {id}
                </Link>
              ))}
            </div>
          ) : (
            <div>loading</div>
          );
        }}
      </F>
    </div>
  );
};
export default Documents;
