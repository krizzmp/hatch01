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
import { LocalNote } from 'src/state/reducers'
import { DefaultText, InnerDivider, OuterDivider } from './styles/editor'
// -----------src-files---------- //
import { Todo } from './styles/todo'
import * as ReactDOM from 'react-dom'

let cuid = require('cuid')

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
  localBox?: LocalNote,
  actions: typeof Actions
}

type MeProps = {
  selected: boolean,
  name: string,
  id: string,
  onClick: any,
  createNoteBeneath: () => void,
  select: (id?: string) => void
}

class MyEditor extends React.Component<MeProps & BoxProps> {
  editor: Editor
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
      this.onBlur()
      this.props.createNoteBeneath()
    },
    'esc': () => {
      this.props.select('')
      this.editor.blur()
    }
  }

  componentWillReceiveProps(nextProps: MeProps) {
    if (this.props.name === nextProps.name && this.state.editing) {
      return
    }
    this.setState({value: Plain.deserialize(nextProps.name)})
  }

  shouldComponentUpdate(np: this['props'], ns: this['state']) {
    let pp = this.props
    return (
      np.id !== pp.id ||
      np.name !== pp.name ||
      np.selected !== pp.selected ||
      ns.editing ||
      (np.localBox && np.localBox.isNew) !== (pp.localBox && pp.localBox.isNew)
    )
  }

  componentDidMount() {
    console.log(this.props.localBox)
    if (this.props.localBox) {
      this.editor.focus()
      setTimeout(
        () => {
          console.log(this.editor)
          let htmlElement = ReactDOM.findDOMNode(this.editor) as HTMLElement
          htmlElement.focus()
          this.editor.change(c => c.selectAll())

        },
        5
      )

    }
    // this.extracted(this.props, false)
  }

  render() {
    return (
      <HotKeys
        handlers={this.handlers}
      >
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          renderNode={renderNode}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          readOnly={!this.props.selected && !(this.props.localBox && this.props.localBox.isNew)}
          onClick={this.props.onClick}
          onKeyDown={(e) => e.shiftKey && e.key === 'Enter' ? false : null}
          ref={ref => this.editor = ref}
        />
      </HotKeys>
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
        onDoubleClick={(e: any) => e.stopPropagation()}
      >
        <MyEditor
          onClick={this.onClick}
          selected={this.props.selected}
          name={this.props.todo.name}
          id={this.props.todo.id}
          actions={this.props.actions}
          createNoteBeneath={this.createNoteBeneath}
          localBox={this.props.localBox}
          select={(id = this.props.todo.id) => this.props.select(id)}
        />
      </Todo>
    )
  }

  createNoteBeneath = () => {
    let margin = 8
    this.props.actions.CreateNote({
      id: cuid(),
      x: this.props.todo.x,
      y: this.props.todo.y + this.props.localBox!.h + margin,
    })
  }

  onClick = (e) => {
    e.stopPropagation()
    this.props.select(this.props.todo.id)
  }

  updateSize = () => {
    const {width, height} = this.bs.getBoundingClientRect()

    if (
      R.anyPass([
          R.complement(R.pathEq(['localBox', 'w'], width)),
          R.complement(R.pathEq(['localBox', 'h'], width))
        ]
      )(this.props)
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