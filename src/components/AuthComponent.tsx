import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

interface Props {
  authExists: boolean;
  history: any;
}
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

export default connect(({ firebase: { auth } }) => ({
  authExists: !!auth && !!auth.uid
}))(withRouter(ProtectedPage));
