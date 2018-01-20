import styled from 'react-emotion'

export const Todos = styled<any, 'div'>('div')(({dx, dy}) => ({
  border: '1px solid #555',
  borderRadius: 4,
  width: 10,
  height: 10,
  left: '50%',
  top: '50%',
  position: 'relative',
  padding: 1,
  transform: `translate(${dx}px, ${dy}px)`
}))
export const Canvas = styled('div')({
  border: '1px solid #777',
  height: 250,
  overflow: 'hidden',
  padding: 1,
  position: 'relative'
})
export const Todo = styled<any, 'div'>('div')(({x, y, dx, dy, dragging, selected}) => ({
  border: selected ? '1px solid #00F' : '1px solid #555',
  left: x + dx,
  top: y + dy,
  position: 'absolute',
  display: 'inline-block',
  transform: 'translate(-50%,-50%)',
  pointerEvents: dragging ? 'none' : 'auto',
  background: '#FFF',
  padding: 0,
  borderRadius: 4,
  paddingTop: 8,
  paddingBottom: 8,
}))
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
let r = (b) => ({x: b.x + b.dx, y: b.y + b.dy})

export const Line = styled<any, 'div'>('div')(({b1, b2}) => {
  let v = vec(r(b1), r(b2))
  return ({
    borderTop: '1px solid #555',
    height: 1,
    left: r(b2).x,
    top: r(b2).y,
    position: 'absolute',
    display: 'inline-block',
    width: Magnitude(v),
    transform: `rotate(${angle(v)}deg)`,
    transformOrigin: '0px 0px',
    textAlign: 'center',
  })
})