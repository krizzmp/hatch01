import * as React from "react";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { RootState } from "src/state/reducers";

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
export default connect(({ firebase: { auth } }: RootState) => ({
  authExists: !!auth && !!auth.uid
}))(withRouter(ProtectedPage));
