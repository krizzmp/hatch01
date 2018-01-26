import styled from 'react-emotion'

export const Todos = styled<any, 'div'>('div')(
  {
    left: '50%',
    top: '50%',
    position: 'relative',
  },
  ({dx, dy}) => ({
    transform: `translate(${dx}px, ${dy}px)`
  })
)