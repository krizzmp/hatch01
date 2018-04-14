import * as React from "react";
import { connect } from "react-redux";
import { LineStyle } from "src/styles/LineStyle";
import styled from "react-emotion";
import colors from "src/styles/colors";
import { LineType } from "src/types";
// import * as R from "ramda";
import { Axjs } from "src/axjs";
//#region s
export type TodoType = {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  name: string;
};
type Tlb = { w: number; h: number };
type P_Line = {
  b1: TodoType;
  b2: TodoType;
  localBox1: Tlb;
  localBox2: Tlb;
  linesRaw: { [id: string]: LineType };
  todosRaw: { [id: string]: TodoType };
  id: string;
};

class LineOld extends React.Component<P_Line> {
  render() {
    return (
      <LineStyle
        b1={this.props.b1}
        b2={this.props.b2}
        localBox1={this.props.localBox1}
        localBox2={this.props.localBox2}
      />
    );
  }
}
//#endregion
{
  // h
}
//#region hellp
class Vector2d {
  y: number;
  x: number;
  constructor(a: Vec, b: Vec) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
  }
  magnitude() {
    // noinspection JSSuspiciousNameCombination
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  angle() {
    return Math.atan2(this.y, this.x) * 180 / Math.PI;
  }
}
type Vec = { x: number; y: number };
const vec = (pos1: Vec, pos2: Vec): Vector2d => {
  return new Vector2d(pos1, pos2);
};
//#endregion
let r = (b, lb) => ({
  ...b,
  x: b.x + b.dx + (lb.w ? lb.w / 2 : 0),
  y: b.y + b.dy + (lb.h ? lb.h / 2 : 0)
});

const srty = (a, b) => {
  if (a.y < b.y) {
    return [b, a];
  } else {
    return [a, b];
  }
};
const srtx = (a, b) => {
  if (a.x < b.x) {
    return [b, a];
  } else {
    return [a, b];
  }
};
const gap = 8;
const UpperLine = styled<any, "div">("div")(({ b1, b2, t }) => {
  let [p1, p2] = srty(b1, b2);
  let v = vec(p1, p2);

  let colorsnoteBorder = p2.id === b1.id ? "red" : "blue";
  return {
    borderLeft: "1px dashed " + colors.noteBorder,
    height: v.y / 2,
    left: p2.x + t * gap,
    top: p2.y,
    position: "absolute",
    display: "inline-block",
    width: 1
  };
});

const LowerLine = styled<any, "div">("div")(({ b1, b2, t }) => {
  let [p1, p2] = srty(b1, b2);
  let v = vec(p1, p2);
  return {
    borderLeft: "1px dashed " + colors.noteBorder,
    height: v.y / 2,
    left: p1.x + t * gap,
    top: p2.y + v.y / 2,
    position: "absolute",
    display: "inline-block",
    width: 1
  };
});
const MiddleLine = styled<any, "div">("div")(({ b1, b2, t1, t2 }) => {
  let [_pr, _pl] = srtx(b1, b2);
  let pr = Object.assign({}, _pr);
  let pl = Object.assign({}, _pl);
  let tl;
  if (b1.y < b2.y) {
    if (b1.x < b2.x) {
      pl.x += t2 * gap; // works
      pr.x += t1 * gap;
    } else {
      pr.x += t2 * gap; // works
      pl.x += t1 * gap; // works
    }
  } else {
    if (b1.x > b2.x) {
      pl.x += t2 * gap;
      pr.x += t1 * gap; // perfect
    } else {
      pr.x += t2 * gap;
      pl.x += t1 * gap; // works
    }
  }
  let v = vec(pr, pl);
  return {
    borderTop: "1px dashed " + colors.noteBorder,
    height: 1,
    left: pl.x,
    top: pl.y + v.y / 2,
    position: "absolute",
    display: "inline-block",
    width: v.x
  };
});

class Line extends React.Component<P_Line> {
  getConnectedBoxes = (box: TodoType, otherBox: TodoType) => {
    let el = new Axjs(Object.values(this.props.linesRaw))
      .map(l => (l.b1 === box.id ? l.b2 : l.b2 === box.id ? l.b1 : null))
      .notNil()
      .map(id => this.props.todosRaw[id!])
      .partition(b => b.y < box.y)
      .map(o =>
        o
          .map(p => {
            let ang = vec(p, box).angle();
            return {
              angle: ang < 0 ? ang : ang * -1,
              box: p
            };
          })
          .sortBy(a => a.angle)
          .map((x, i, arr) => ({
            index: i,
            el: x.box,
            count: arr!.length
          }))
          .find(x => x.el.id === otherBox.id)
      )
      .notNil()
      .head()!;
    return el.index - (el.count - 1) / 2;
  };
  fn = () => {
    let [bb, bt] = srty(this.props.b1, this.props.b2);
    return this.getConnectedBoxes(bb, bt);
  };
  fn2 = () => {
    let [bb, bt] = srty(this.props.b1, this.props.b2);
    return this.getConnectedBoxes(bt, bb);
  };
  render() {
    return (
      <>
        <UpperLine
          b1={r(this.props.b1, this.props.localBox1)}
          b2={r(this.props.b2, this.props.localBox2)}
          t={this.fn2()}
        />
        <LowerLine
          b1={r(this.props.b1, this.props.localBox1)}
          b2={r(this.props.b2, this.props.localBox2)}
          t={this.fn()}
        />
        <MiddleLine
          b1={r(this.props.b1, this.props.localBox1)}
          b2={r(this.props.b2, this.props.localBox2)}
          t1={this.fn()}
          t2={this.fn2()}
        />
      </>
    );
  }
}

let en1 = connect((s: any, p: any) => ({
  localBox1: s.local[p.b1.id],
  localBox2: s.local[p.b2.id]
}));
export default en1(Line);
