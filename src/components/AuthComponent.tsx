import * as React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";

type Props = {
  authExists: boolean;
} & RouteComponentProps<any>;
class ProtectedPage extends React.Component<Props> {
  componentWillReceiveProps({ authExists, history }: Props) {
    if (!authExists) {
      history.push("/"); // redirect to /login if not authed
    }
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
type f = { firebase: { auth: { uid: string } } };
export default connect(({ firebase: { auth } }: f) => ({
  authExists: !!auth && !!auth.uid
}))(withRouter(ProtectedPage));
