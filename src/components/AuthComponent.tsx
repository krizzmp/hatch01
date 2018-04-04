import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class ProtectedPage extends React.Component<{ authExists: boolean, history: any }> {

  componentWillReceiveProps({authExists, history}: { authExists: boolean, history: any }) {
    if (!authExists) {
      history.push('/') // redirect to /login if not authed
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default connect(
  ({firebase: {auth}}) => ({authExists: !!auth && !!auth.uid})
)(withRouter(ProtectedPage))