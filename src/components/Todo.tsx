import * as React from 'react'
import * as style from '../styles'
import { Composer } from '../ReComposeClass'
import { TodoType } from './App'

import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

type TodoProps = {
  todo: TodoType,
  onDragStart: (e: any, todo: TodoType) => void,
  dragging: boolean,
}
const renderNode = (props) => {
  const {node, attributes, children} = props
  if (props.isSelected || node.text !== '---') {
    return (
      <div
        style={{
          paddingLeft: 4,
          paddingRight: 4,
        }}
        {...attributes}
      >
        {children}
      </div>
    )
  } else {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          color: '#f0f0f0',
          margin: 0,
          padding: 0,

        }}
        {...attributes}
      >
        <div
          style={{
            background: 'black',
            height: 1,
            width: '100%',
            top: '50%',
            display: 'block',
            flexAlign: 'center',
            float: 'left',
            position: 'absolute',
            margin: 0,
            padding: 0,
          }}
        />
        {children}
      </div>
    )
  }
}

type MeProps = {
  todo: TodoType,
  firebase: any,
  onDragStart: any,
  dragging: boolean,
}

class MyEditor extends React.Component<MeProps> {
  state = {
    value: Plain.deserialize(this.props.todo.name),
    editing: false,
    readonly: true,
  }

  componentWillReceiveProps(nextProps: MeProps) {
    if (this.props.todo.name !== nextProps.todo.name && this.state.editing === false) {
      this.setState({value: Plain.deserialize(nextProps.todo.name)})
    }
  }

  render() {
    return (
      <style.Todo
        {...this.props.todo}
        onDragStart={this.props.onDragStart}
        draggable="true"
        data-box-id={this.props.todo.id}
        dragging={this.props.dragging}
        selected={!this.state.readonly}
      >
        <Editor
          placeholder="Enter some plain text..."
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          readOnly={this.state.readonly}
          onClick={this.onClick}
        />
      </style.Todo>
    )
  }

  onClick = () => {
    this.setState({readonly: false})
  }
  onChange = ({value}) => {
    this.setState({value})
  }
  onBlur = (e) => {
    let name = Plain.serialize(this.state.value)
    this.setState({readonly: true, editing: false})
    this.props.firebase.update(`todos/${this.props.todo.id}`, {name})

  }
  onFocus = () => {
    this.setState({editing: true})
  }
}

let Todo = new Composer<TodoProps>()
  .withFirebase()
  .withHandler((p) => ({
    onDragStartHandler: (e) => {
      e.preventDefault()
      p.onDragStart(e, p.todo)
    }
  }))
  .render(({todo, onDragStartHandler, dragging, firebase}) => (

    <MyEditor
      onDragStart={onDragStartHandler}
      dragging={dragging}
      todo={todo}
      firebase={firebase}
    />
  ))
export default Todo