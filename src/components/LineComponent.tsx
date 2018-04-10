import * as React from "react";
import { connect } from "react-redux";
import { LineStyle } from "src/styles/LineStyle";
import styled from "react-emotion";
import colors from "src/styles/colors";
import { LineType } from "src/types";
import * as R from "ramda";

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
type Vec = { x: number; y: number };
const vec = (pos1: Vec, pos2: Vec): Vec => {
  return {
    x: pos1.x - pos2.x,
    y: pos1.y - pos2.y
  };
};
let Magnitude = function(v: Vec) {
  // noinspection JSSuspiciousNameCombination
  return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
};
let angle = (v: Vec) => {
  return Math.atan2(v.y, v.x) * 180 / Math.PI;
};
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
const LineStyle2 = styled<any, "div">("div")(({ b1, b2, t }) => {
  let [p1, p2] = srty(b1, b2);
  let v = vec(p1, p2);

  let colorsnoteBorder = p2.id === b1.id ? "red" : "blue";
  return {
    borderLeft: "1px dashed " + colors.noteBorder,
    height: v.y / 2,
    left: p2.x + t * 10,
    top: p2.y,
    position: "absolute",
    display: "inline-block",
    width: 1
  };
});

const LineStyle3 = styled<any, "div">("div")(({ b1, b2, t }) => {
  let [p1, p2] = srty(b1, b2);
  let v = vec(p1, p2);
  return {
    borderLeft: "1px dashed " + colors.noteBorder,
    height: v.y / 2,
    left: p1.x + t * 10,
    top: p2.y + v.y / 2,
    position: "absolute",
    display: "inline-block",
    width: 1
  };
});
const LineStyle4 = styled<any, "div">("div")(({ b1, b2, t1, t2 }) => {
  let [_pr, _pl] = srtx(b1, b2);
  let pr = Object.assign({}, _pr);
  let pl = Object.assign({}, _pl);
  let tl;
  if (b1.y < b2.y) {
    if (b1.x < b2.x) {
      pl.x += t2 * 10; // works
      pr.x += t1 * 10;
    } else {
      pr.x += t2 * 10; // works
      pl.x += t1 * 10; // works
    }
  } else {
    if (b1.x > b2.x) {
      pr.x += t1 * 10; // perfect
      pl.x += t2 * 10;
    } else {
      pl.x += t1 * 10; // works
      pr.x += t2 * 10;
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
function getConnectedLines(
  lines: { [id: string]: LineType },
  lineProps: P_Line,
  notes: { [id: string]: TodoType }
) {
  let b1 = lineProps.b1.id;
  let isConnected = line => line.b1 === b1 || line.b2 === b1;

  let getLineId = R.pipe(
    R.defaultTo({}),
    R.filter(isConnected),
    R.values,

    R.sortBy(
      R.pipe(
        (l: LineType) => (l.b1 === b1 ? l.b2 : l.b1),
        bid => notes[bid],
        n => n.x
      )
    ),
    R.mapAccum((a, x) => [a + 1, [a, x]], 0),
    a => a[1]
  );

  return getLineId(lines);
}

class Line extends React.Component<P_Line> {
  getConnectedBoxes = (box: TodoType) => {
    const top = l => {
      return srty(l.b1, l.b2)[0];
    };
    const bottom = l => {
      return srty(l.b1, l.b2)[1];
    };
    let d = R.pipe(
      R.mapObjIndexed(
        (l: LineType): string | undefined =>
          l.b1 === box.id ? l.b2 : l.b2 === box.id ? l.b1 : undefined
      ),

      R.filter<string | undefined>(id => (id === undefined ? false : true)),
      R.values,
      R.map(id => this.props.todosRaw[id!]),
      R.sortBy((b: TodoType) => b.x)
    );
    return d(this.props.linesRaw);
  };
  fn = () => {
    let [bb, bt] = srty(this.props.b1, this.props.b2);
    let l = this.getConnectedBoxes(bb);

    let y = R.indexOf(bt, l) - (l.length - 1) / 2;
    if (l.length === 1 || R.indexOf(bt, l) === -1) {
      y = 0;
    }

    return y;
  };
  fn2 = () => {
    let [bb, bt] = srty(this.props.b1, this.props.b2);
    let l = this.getConnectedBoxes(bt);

    let y = R.indexOf(bb, l) - (l.length - 1) / 2;
    if (l.length === 1 || R.indexOf(bb, l) === -1) {
      y = 0;
    }
    return y;
  };
  render() {
    return (
      <>
        <LineStyle2
          b1={r(this.props.b1, this.props.localBox1)}
          b2={r(this.props.b2, this.props.localBox2)}
          t={this.fn2()}
        />
        <LineStyle3
          b1={r(this.props.b1, this.props.localBox1)}
          b2={r(this.props.b2, this.props.localBox2)}
          t={this.fn()}
        />
        <LineStyle4
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
