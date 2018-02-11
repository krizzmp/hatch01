import styled from 'react-emotion'
import colors from '../../../styles/colors'

type Vec = { x: number, y: number }
const vec = (pos1: Vec, pos2: Vec): Vec => {
  return {
    x: pos1.x - pos2.x,
    y: pos1.y - pos2.y,
  }
}
let Magnitude = function (v: Vec) {
  // noinspection JSSuspiciousNameCombination
  return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
}
let angle = (v: Vec) => {
  return Math.atan2(v.y, v.x) * 180 / Math.PI
}
let r = (b, lb) => ({
  x: b.x + b.dx + (lb.w ? (lb.w / 2) : 0),
  y: b.y + b.dy + (lb.h ? (lb.h / 2) : 0)
})

export const Line = styled<any, 'div'>('div')(({b1, b2, localBox1, localBox2}) => {
  let v = vec(r(b1, localBox1), r(b2, localBox2))
  return ({
    borderTop: '1px dashed ' + colors.noteBorder,
    height: 1,
    left: r(b2, localBox2).x,
    top: r(b2, localBox2).y,
    position: 'absolute',
    display: 'inline-block',
    width: Magnitude(v),
    transform: `rotate(${angle(v)}deg)`,
    transformOrigin: '0px 0px',
    textAlign: 'center',
  })
})