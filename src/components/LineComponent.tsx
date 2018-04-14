import * as React from "react";
import { connect } from "react-redux";
import styled from "react-emotion";
import colors from "src/styles/colors";
import { LineType } from "src/types";
import { Axjs } from "src/axjs";
//#region types
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
//#endregion
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

let centerPos = (b: TodoType, lb: Tlb) => ({
  ...b,
  x: b.x + b.dx + (lb.w ? lb.w / 2 : 0),
  y: b.y + b.dy + (lb.h ? lb.h / 2 : 0),
  ...lb
});

function srty<T extends { y: number }>(a: T, b: T): [T, T] {
  if (a.y < b.y) {
    return [b, a];
  } else {
    return [a, b];
  }
}
function srtx<T extends { x: number }>(a: T, b: T): [T, T] {
  if (a.x < b.x) {
    return [b, a];
  } else {
    return [a, b];
  }
}
class Line extends React.Component<P_Line> {
  getBoxes = () => {
    let b1 = centerPos(this.props.b1, this.props.localBox1);
    let b2 = centerPos(this.props.b2, this.props.localBox2);
    let b1i = this.getConnectedBoxes(b1, b2);
    let b2i = this.getConnectedBoxes(b2, b1);
    let n1 = { i: b1i, ...b1 };
    let n2 = { i: b2i, ...b2 };
    let [r, l] = srtx(n1, n2);
    let [b, t] = srty(n1, n2);
    let tl = {
      x: l.x + l.i * this.gap,
      y: t.y + t.h / 2
    };
    let br = {
      x: r.x + r.i * this.gap,
      y: b.y - b.h / 2
    };
    let bb = {
      x: b.x + b.i * this.gap,
      y: b.y - b.h / 2
    };
    let tt = {
      x: t.x + t.i * this.gap,
      y: t.y + t.h / 2
    };
    return { tl, br, bb, tt };
  };
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
  gap = 8;
  UpperLine = styled("div")(() => {
    let { bb, tt } = this.getBoxes();
    return {
      borderLeft: "1px dashed " + colors.noteBorder,
      height: (bb.y - tt.y) / 2,
      left: tt.x,
      top: tt.y,
      position: "absolute",
      display: "inline-block",
      width: 1
    };
  });

  MiddleLine = styled("div")(() => {
    let { tl, br, tt, bb } = this.getBoxes();
    return {
      borderTop: "1px dashed " + colors.noteBorder,
      height: 1,
      left: tl.x,
      top: tt.y + (bb.y - tt.y) / 2,
      position: "absolute",
      display: "inline-block",
      width: br.x - tl.x
    };
  });
  LowerLine = styled("div")(() => {
    let { tl, br, bb } = this.getBoxes();
    return {
      borderLeft: "1px dashed " + colors.noteBorder,
      height: (br.y - tl.y) / 2,
      left: bb.x,
      top: tl.y + (br.y - tl.y) / 2,
      position: "absolute",
      display: "inline-block",
      width: 1
    };
  });
  render() {
    return (
      <>
        <this.UpperLine />
        <this.LowerLine />
        <this.MiddleLine />
      </>
    );
  }
}

let en1 = connect((s: any, p: any) => ({
  localBox1: s.local[p.b1.id],
  localBox2: s.local[p.b2.id]
}));
export default en1(Line);
