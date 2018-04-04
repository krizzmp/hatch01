import * as React from 'react'
import { connect } from 'react-redux'
import { Line as LineStyle } from './styles/line'

export type TodoType = {
  id: string,
  x: number, y: number,
  dx: number, dy: number,
  name: string
}
type lb = { w: number, h: number }
type g = { b1: TodoType, b2: TodoType, localBox1: lb, localBox2: lb }

class Line extends React.Component<g> {
  // shouldComponentUpdate(np: g) {
  //   const pp = this.props
  //   return (
  //     np.b1.x === pp.b1.x &&
  //     np.b1.y === pp.b1.y &&
  //     np.b1.dx === pp.b1.dx &&
  //     np.b1.dy === pp.b1.dy &&
  //
  //     np.b2.x === pp.b2.x &&
  //     np.b2.y === pp.b2.y &&
  //     np.b2.dx === pp.b2.dx &&
  //     np.b2.dy === pp.b2.dy &&
  //
  //     np.localBox1.w === pp.localBox1.w &&
  //     np.localBox1.h === pp.localBox1.h &&
  //
  //     np.localBox2.w === pp.localBox2.w &&
  //     np.localBox2.h === pp.localBox2.h
  //   )
  // }

  render() {
    return (
      <LineStyle
        b1={this.props.b1}
        b2={this.props.b2}
        localBox1={this.props.localBox1}
        localBox2={this.props.localBox2}
      />
    )
  }
}

let en1 = connect(
  (s: any, p: any) => ({
    localBox1: s.local[p.b1.id],
    localBox2: s.local[p.b2.id],
  }))
export default en1(Line)