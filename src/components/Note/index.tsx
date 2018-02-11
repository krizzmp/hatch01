import * as R from 'ramda'
import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { connect } from 'react-redux'
import { withFirebase } from 'react-redux-firebase'
import { bindActionCreators } from 'redux'
import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'
import * as Actions from 'src/state/actions'
import { TodoType } from 'src/components/Line'
import { DefaultText, InnerDivider, OuterDivider } from './styles/editor'
// -----------src-files---------- //
import { Todo } from './styles/todo'

export type TodoProps = {
  todo: TodoType,
  onDragStart: (e: any, todo: TodoType) => void,
  dragging: boolean,
  select: (id: string) => void,
  selected: boolean,
}
const renderNode = ({node, attributes, children, isSelected}) => {
  if (isSelected || node.text !== '---') {
    return (
      <DefaultText {...attributes}>
        {children}
      </DefaultText>
    )
  } else {
    return (
      <OuterDivider {...attributes}>
        <InnerDivider/>
        {children}
      </OuterDivider>
    )
  }
}
type BoxProps = {
  firebase: any,
  localBox?: any,
  actions: typeof Actions
}

type MeProps = {
  selected: boolean,
  name: string,
  id: string,
  onClick: any,
}

class MyEditor extends React.Component<MeProps & BoxProps> {
  state = {
    value: Plain.deserialize(this.props.name),
    editing: false,
  }
  handlers = {
    'remove': () => {
      if (!this.state.editing) {
        this.props.actions.RemoveNote({id: this.props.id})
      }
    },
    'shiftie': () => {
      //
    }
  }

  componentWillReceiveProps(nextProps: MeProps) {
    if (this.props.name === nextProps.name && this.state.editing) {
      return
    }
    this.setState({value: Plain.deserialize(nextProps.name)})
  }

  shouldComponentUpdate(np: MeProps, ns: any) {
    let pp = this.props
    return !(
      np.id === pp.id &&
      np.name === pp.name &&
      np.selected === pp.selected &&
      !ns.editing
    )
  }

  onChange = ({value}) => {
    this.setState({value})
  }
  onBlur = () => {
    let name = Plain.serialize(this.state.value)
    this.props.actions.UpdateNoteText({id: this.props.id, name})
    this.setState({editing: false})
  }
  onFocus = () => {
    this.setState({editing: true})
  }

  render() {
    return (
      <HotKeys handlers={this.handlers}>
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          readOnly={!this.props.selected}
          onClick={this.props.onClick}
          onKeyDown={(e) => e.shiftKey && e.key === 'Enter' ? false : null}
        />
      </HotKeys>
    )
  }
}

class Box extends React.Component<BoxProps & TodoProps> {
  bs: HTMLDivElement

  componentDidMount() {
    this.updateSize()
  }

  componentDidUpdate() {
    this.updateSize()
  }

  shouldComponentUpdate(np: BoxProps & TodoProps, ns: any) {
    let pp = this.props
    return !(
      np.todo.id === pp.todo.id &&
      np.todo.name === pp.todo.name &&
      np.todo.x === pp.todo.x &&
      np.todo.y === pp.todo.y &&
      np.todo.dx === pp.todo.dx &&
      np.todo.dy === pp.todo.dy &&
      np.dragging === pp.dragging &&
      np.selected === pp.selected
    )
  }

  render() {
    return (
      <Todo
        {...this.props.todo}
        onDragStart={this.onDragStart}
        draggable="true"
        data-box-id={this.props.todo.id}
        dragging={this.props.dragging}
        selected={this.props.selected}
        innerRef={(ref) => this.bs = ref}
        onDoubleClick={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <MyEditor
          onClick={this.onClick}
          selected={this.props.selected}
          firebase={this.props.firebase}
          name={this.props.todo.name}
          id={this.props.todo.id}
          actions={this.props.actions}
        />
      </Todo>
    )
  }

  onClick = (e) => {
    e.stopPropagation()
    this.props.select(this.props.todo.id)
  }

  updateSize = () => {
    const {width, height} = this.bs.getBoundingClientRect()
    if (
      !R.pathEq(['localBox', 'w'], width, this.props) ||
      !R.pathEq(['localBox', 'h'], height, this.props)
    ) {
      this.props.actions.UpdateNoteSize({id: this.props.todo.id, h: height, w: width})
    }
  }

  onDragStart = (e) => {
    e.preventDefault()
    this.props.onDragStart(e, this.props.todo)
  }
}

const enhancer = connect(
  (s: any, p: any) => ({
    localBox: s.local[p.todo.id]
  }),
  (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
  }))
export default withFirebase(enhancer(Box as any))