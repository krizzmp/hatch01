import styled from 'react-emotion'
import colors from './colors'

export const DefaultText = styled('div')({
  paddingLeft: 4,
  paddingRight: 4,
})
export const OuterDivider = styled('div')({
  position: 'relative',
  color: '#f0f0f0',
  margin: 0,
  padding: 0,
})
export const InnerDivider = styled('div')({
  background: colors.noteBorder,
  height: 1,
  width: '100%',
  top: '50%',
  display: 'block',
  position: 'absolute',
  margin: 0,
  padding: 0,
})