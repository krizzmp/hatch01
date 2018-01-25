import styled from 'react-emotion'

export const Todos = styled<any, 'div'>('div')(
  {
    width: 1,
    height: 1,
    left: '50%',
    top: '50%',
    position: 'relative',
    padding: 1,
  },
  ({dx, dy}) => ({
    transform: `translate(${dx}px, ${dy}px)`
  })
)