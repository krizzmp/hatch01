import * as React from 'react'
import { firebaseConnect, getVal } from 'react-redux-firebase'
import * as _ from 'lodash'
import * as style from '../styles/styles'
import Todo from './Todo'
import { HotKeys } from 'react-hotkeys'
import { TodoType } from './Line'
import Line from '../components/Line'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { css } from 'emotion'
import {
  ConnectNote, RemoveNote, DisconnectLine
} from '../sagas'
import { bindActionCreators } from 'redux'
import { rootId } from '../utils'

let cuid = require('cuid')
const Actions = {ConnectNote, RemoveNote, DisconnectLine}

const TextFieldBox = () => (
  <div
    className={css({
      height: 44,
      backgroundColor: 'rgba(255,255,255,0.10)',
      display: 'inline-block',
      borderRadius: 4,
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 16,
      paddingRight: 16,
      fontSize: '16px',
      fontFamily: 'Roboto',
      fontWeight: 300,
      boxSizing: 'border-box',
      color: 'rgba(255,255,255,0.70)',
      position: 'relative',
      overflow: 'hidden',
      '&:after': {
        content: '""',
        background: 'rgba(0,0,0,0.42)',
        height: '2px',
        width: '100%',
        display: 'block',
        position: 'absolute',
        bottom: 0,
        left: 0,
      }
    })}
  >
    Label
  </div>
)

const ToolBar = () => (
  <div
    className={css({
      height: 64,
      backgroundColor: '#3949AB',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    })}
  >
    {false && <TextFieldBox/>}
  </div>
)

type AppProps = {
  firebase: any,
  todosRaw: any,
  linesRaw: any,
  actions: typeof Actions
}

class App extends React.PureComponent<AppProps> {
  $canvas
  state = {
    dx: 0, dy: 0,
    dragging: undefined as TodoType | undefined,
    draggingInitPos: undefined as { x: number, y: number } | undefined,
    selected: '' as string
  }
  Lines = () => _.values(this.props.linesRaw).map((line) => (
      <Line
        key={line.id}
        b1={this.props.todosRaw[line.b1]}
        b2={this.props.todosRaw[line.b2]}
      />
    )
  )

  Boxes = () => _.values(this.props.todosRaw).map((todo) => (
      <Todo
        key={todo.id}
        todo={todo}
        onDragStart={this.dragStart}
        dragging={!!this.state.dragging && todo.id === this.state.dragging.id}
        selected={this.state.selected === todo.id}
        select={this.select}
      />
    )
  )
  pan = (e) => {
    e.preventDefault()
    if (e.ctrlKey) {
      e.stopPropagation()
    }
    this.setState({dy: this.state.dy + e.deltaY * -1, dx: this.state.dx + e.deltaX * -1})
  }

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

    let todo = this.props.todosRaw[this.state.dragging.id]
    let el = document.querySelector('[data-box-id]:hover')
    if (el) {
      let b1 = el.getAttribute('data-box-id')
      let filter =
        R.filter(
          (line) => (
            (line.b1 === b1 && line.b2 === todo.id) ||
            (line.b1 === todo.id && line.b2 === b1)
          )
        )

      let keys = R.keys(filter(R.defaultTo({}, this.props.linesRaw)))
      if (keys.length === 0) {
        this.props.actions.ConnectNote({b1: b1!, b2: todo.id})
      } else {
        this.props.actions.DisconnectLine({lineId: keys[0], noteId: todo.id})
      }
    } else {
      this.props.firebase.update(`${rootId}/todos/${todo.id}`, {
        x: todo.x + todo.dx, y: todo.y + todo.dy,
        dx: 0, dy: 0,
      })
    }
    this.setState({dragging: undefined, draggingInitPos: undefined})
  }

  select = (id) => {
    this.setState({selected: id})
  }
  createTodo = (e, canvas) => {
    let bcr = canvas.getBoundingClientRect()
    const x = e.clientX - (bcr.left)
    const y = e.clientY - (bcr.top)
    const id = cuid()
    this.props.firebase.set(`${rootId}/todos/${id}`, {
      id, name: 'fsd',
      x, y, dx: 0, dy: 0
    })
  }
  onMouseMove = (e) => {
    if (this.state.dragging && this.state.draggingInitPos) {
      const dx = e.clientX - this.state.draggingInitPos.x
      const dy = e.clientY - this.state.draggingInitPos.y
      this.props.firebase.update(`${rootId}/todos/${this.state.dragging.id}`, {dx, dy})
    }
  }

  render() {
    return (
      <React.Fragment>
        <ToolBar/>
        <HotKeys
          keyMap={{'remove': 'del', 'shiftie': 'shift+return'}}
          className={css({flex: 1, display: 'flex'})}
        >
          <style.Canvas
            onDoubleClick={(e) => this.createTodo(e, this.$canvas)}
            onClick={() => this.select('')}
            onWheel={this.pan}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onDragEnd}
          >
            <style.Todos
              innerRef={(input) => this.$canvas = input}
              dy={this.state.dy}
              dx={this.state.dx}
            >
              {this.Lines()}
              {this.Boxes()}
            </style.Todos>
          </style.Canvas>
        </HotKeys>
      </React.Fragment>
    )
  }
}

const en1 = firebaseConnect([`${rootId}/todos`, `${rootId}/lines`])(
  connect(
    ({firebase}: any) => ({
      todosRaw: getVal(firebase, `data/${rootId}/todos`, {}),
      linesRaw: getVal(firebase, `data/${rootId}/lines`, {}),
    }),
    (dispatch) => ({
      actions: bindActionCreators(Actions, dispatch)
    })
  )
  (App)
)

export default en1