import styled from 'react-emotion'
import colors from './colors'
export const Todo = styled<any, 'div'>('div')(
  {
    position: 'absolute',
    display: 'inline-block',
    background: colors.noteBg,
    padding: 0,
    borderRadius: 4,
    paddingTop: 8,
    paddingBottom: 8,
    userSelect: 'none',
    color: colors.noteText,
    fontSize: '16px',
    fontFamily: 'Roboto',
    fontWeight: 300,
  },
  ({x, y, dx, dy, dragging, selected}) => ({
    border: selected ? '1px solid blue' : '1px solid ' + colors.noteBorder,
    left: x + dx,
    top: y + dy,
    pointerEvents: dragging ? 'none' : 'auto',
  })
)