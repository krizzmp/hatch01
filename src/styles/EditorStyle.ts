import styled from 'react-emotion'
import colors from '../../../styles/colors'

export const DefaultText = styled<{field: boolean, h1: boolean}, 'div'>('div')(
  {
    paddingRight: '1.5ch',
    // background: 'red'
  },
  ({field, h1}) => ({
    paddingLeft: field || h1 ? '0.5ch' : '1.5ch',
    fontWeight: h1 ? 400 : 300,
  })
)
export const OuterDivider = styled('div')(
  {
    position: 'relative',
    color: '#f0f0f0',
    margin: 0,
    padding: 0,
  })
export const InnerDivider = styled<{dashed: boolean}, 'div'>('div')(
  {
  // background: colors.noteBorder,
  height: 0,
  width: '100%',
  top: '40%',
  display: 'block',
  position: 'absolute',
  margin: 0,
  padding: 0,
},
  ({dashed}) => ({
    borderTop: `1px ${dashed ? 'dashed' : 'solid'} ${colors.noteBorder}`
  }))