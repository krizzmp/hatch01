import * as R from 'ramda'
import * as React from 'react'
import { bindActionCreators } from 'redux'
import { fbConnect } from 'src/extra'
import { LineType } from 'src/types'
import { Canvas } from './components/Canvas'
import Line, { TodoType } from 'src/components/Line'
import Note from 'src/components/Note'
import * as Actions from 'src/state/actions'

let cuid = require('cuid')

function getConnectedLine(lines: { [id: string]: LineType }, b1: string, b2: string) {

  let isConnected = (line) => (
    (line.b1 === b1 && line.b2 === b2) ||
    (line.b1 === b2 && line.b2 === b1)
  )

  let getLineId = R.pipe(
    R.defaultTo({}),
    R.filter(isConnected),
    R.keys,
    R.head
  )

  return getLineId(lines)
}

type AppProps = {
  todosRaw: any,
  linesRaw: { [id: string]: LineType },
  selected: string,
  actions: typeof Actions,
  match: any
}

class App extends React.Component<AppProps> {
  $center
  state = {
    dragging: undefined as TodoType | undefined,
    draggingInitPos: undefined as { x: number, y: number } | undefined,
  }
  Lines = R.pipe(
    R.values,
    R.map((line: LineType) => (
      <Line
        key={line.id}
        b1={this.props.todosRaw[line.b1]}
        b2={this.props.todosRaw[line.b2]}
      />
    ))
  )

  Notes = R.pipe(
    R.values,
    R.map((todo) => (
      <Note
        key={todo.id}
        todo={todo}
        onDragStart={this.dragStart}
        dragging={!!this.state.dragging && todo.id === this.state.dragging.id}
        selected={this.props.selected === todo.id}
        select={this.select}
        projectId={this.props.match.params.id}
      />
    ))
  )

  dragStart = (e, todo) => {
    this.setState({
      dragging: todo,
      draggingInitPos: {x: e.clientX, y: e.clientY}
    })
  }

  onDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!this.state.dragging) {
      return
    }
    let projectId = this.props.match.params.id
    let todo = this.props.todosRaw[this.state.dragging.id]
    let el = document.querySelector('[data-box-id]:hover')
    if (el) {
      let b1 = el.getAttribute('data-box-id')!
      let b2 = todo.id

      let connectedLine = getConnectedLine(this.props.linesRaw, b1, b2)
      if (connectedLine) {
        this.props.actions.DisconnectLine({lineId: connectedLine, noteId: b2, projectId})
      } else {
        this.props.actions.ConnectNote({b1, b2, projectId})
      }
    } else {
      const {id, x, y, dx, dy} = todo
      this.props.actions.MoveNote({id, x, y, dx, dy, projectId})
    }
    this.setState({dragging: undefined, draggingInitPos: undefined})
  }

  select = (id) => {
    this.props.actions.SelectNote({id})
  }
  createTodo = (e, canvas) => {
    let bcr = canvas.getBoundingClientRect()
    const x = e.clientX - (bcr.left)
    const y = e.clientY - (bcr.top)
    let projectId = this.props.match.params.id

    this.props.actions.CreateNote({id: cuid(), x, y, projectId})
  }
  onMouseMove = (e) => {
    if (this.state.dragging && this.state.draggingInitPos) {
      const id = this.state.dragging.id
      const dx = e.clientX - this.state.draggingInitPos.x
      const dy = e.clientY - this.state.draggingInitPos.y
      let projectId = this.props.match.params.id
      this.props.actions.MoveDelta({id, dx, dy, projectId})
    }
  }

  render() {
    console.log(this.props.match)
    return (
      <React.Fragment>
        <Canvas
          onMouseMove={this.onMouseMove}
          onDoubleClick={(e) => this.createTodo(e, this.$center)}
          onClick={() => this.select('')}
          onMouseUp={this.onDragEnd}
          centerRef={(ref) => this.$center = ref}
        >
          {this.Lines(this.props.linesRaw)}
          {this.Notes(this.props.todosRaw)}
        </Canvas>
      </React.Fragment>
    )
  }
}

const enhance = fbConnect(
  (props) => props.match.params.id,
  ['todos', 'lines'],
  (state, firebase) => ({
    todosRaw: firebase('todos'),
    linesRaw: firebase('lines'),
    selected: state.canvas.selected
  }),
  (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
  })
)
export default enhance(App)