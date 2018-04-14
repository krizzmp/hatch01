import * as R from "ramda";
import * as React from "react";
import { bindActionCreators } from "redux";
import { fbConnect } from "src/utils";
import { LineType } from "src/types";
import { Canvas } from "src/components/CanvasComponent";
import Line, { TodoType } from "src/components/LineComponent";
import Note from "src/components/NoteComponent";
import * as Actions from "src/state/actions/index";
import { Axjs } from "src/axjs";

let cuid = require("cuid");

function getConnectedLine(
  lines: { [id: string]: LineType },
  b1: string,
  b2: string
): LineType {
  let isConnected = (line: LineType) =>
    (line.b1 === b1 && line.b2 === b2) || (line.b1 === b2 && line.b2 === b1);

  // return getLineId(Object.values(lines));
  let g = new Axjs(Object.values(lines)).filter(isConnected).head();
  return g!;
}

type AppProps = {
  todosRaw: { [id: string]: TodoType };
  linesRaw: { [id: string]: LineType };
  selected: string;
  actions: typeof Actions;
  match: any;
};

class App extends React.Component<AppProps> {
  $center?: Element;
  state = {
    dragging: undefined as TodoType | undefined,
    draggingInitPos: undefined as { x: number; y: number } | undefined
  };
  Lines = R.pipe(
    R.values,
    R.map((line: LineType) => (
      <Line
        key={line.id}
        id={line.id}
        b1={this.props.todosRaw[line.b1]}
        b2={this.props.todosRaw[line.b2]}
        linesRaw={this.props.linesRaw}
        todosRaw={this.props.todosRaw}
      />
    ))
  );

  Notes = R.pipe(
    R.values,
    R.map((todo: TodoType) => (
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
  );

  dragStart = (e: React.DragEvent<HTMLDivElement>, todo: TodoType) => {
    this.setState({
      dragging: todo,
      draggingInitPos: { x: e.clientX, y: e.clientY }
    });
  };

  onDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!this.state.dragging) {
      return;
    }
    let projectId = this.props.match.params.id;
    let todo: TodoType = this.props.todosRaw[this.state.dragging.id];
    let el = document.querySelector("[data-box-id]:hover");
    if (el) {
      let b1 = el.getAttribute("data-box-id")!;
      let b2 = todo.id;

      let connectedLine = getConnectedLine(this.props.linesRaw, b1, b2);
      if (connectedLine) {
        this.props.actions.DisconnectLine({
          lineId: connectedLine.id,
          noteId: b2,
          projectId
        });
      } else {
        this.props.actions.ConnectNote({ b1, b2, projectId });
      }
    } else {
      const { id, x, y, dx, dy } = todo;
      this.props.actions.MoveNote({ id, x, y, dx, dy, projectId });
    }
    this.setState({ dragging: undefined, draggingInitPos: undefined });
  };

  select = (id: string) => {
    this.props.actions.SelectNote({ id });
  };
  createTodo = (e: React.MouseEvent<HTMLDivElement>, canvas: Element) => {
    let bcr = canvas.getBoundingClientRect();
    const x = e.clientX - bcr.left;
    const y = e.clientY - bcr.top;
    let projectId = this.props.match.params.id;

    this.props.actions.CreateNote({ id: cuid(), x, y, projectId });
  };
  onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.dragging && this.state.draggingInitPos) {
      const id = this.state.dragging.id;
      const dx = e.clientX - this.state.draggingInitPos.x;
      const dy = e.clientY - this.state.draggingInitPos.y;
      let projectId = this.props.match.params.id;
      this.props.actions.MoveDelta({ id, dx, dy, projectId });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Canvas
          onMouseMove={this.onMouseMove}
          onDoubleClick={(e: React.MouseEvent<HTMLDivElement>) =>
            this.createTodo(e, this.$center!)
          }
          onClick={() => this.select("")}
          onMouseUp={this.onDragEnd}
          centerRef={ref => (this.$center = ref)}
        >
          {this.Lines(this.props.linesRaw)}
          {this.Notes(this.props.todosRaw)}
        </Canvas>
      </React.Fragment>
    );
  }
}

const enhance = fbConnect(
  props => props.match.params.id,
  ["todos", "lines"],
  (state, firebase) => ({
    todosRaw: firebase("todos"),
    linesRaw: firebase("lines"),
    selected: state.canvas.selected
  }),
  dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
  })
);
export default enhance(App);
