import * as React from "react";
import { withFirebase } from "react-redux-firebase";
import { Link } from "react-router-dom";
import Documents from "./Documents";
class Home extends React.Component<{ firebase: any }> {
  render() {
    return (
      <div>
        <h1>Welcome to Hatch</h1>
        <p>Hatch is an intuitive diagramming tool.</p>
        <button onClick={this.login}>login</button>
        <Link to="/app">Open Default Document</Link>
        <Documents />
      </div>
    );
  }

  private login = () => {
    this.props.firebase.login({
      provider: "google",
      type: "popup"
    });
  };
}

export default withFirebase(Home);
