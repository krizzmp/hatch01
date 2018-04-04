import { css } from 'emotion'
import * as React from 'react'
import { HotKeys } from 'react-hotkeys'
import { Center } from './styles/center'
import { Canvas as CanvasStyle } from './styles/canvas'

type CanvasProps = {
  centerRef?: (ref: HTMLDivElement) => void,
  onMouseMove: any,
  onDoubleClick: any,
  onClick: any,
  onMouseUp: any
}

export class Canvas extends React.Component<CanvasProps> {
  state = {
    dx: 0, dy: 0,
  }
  pan = (e) => {
    e.preventDefault()
    if (e.ctrlKey) {
      e.stopPropagation()
    }
    this.setState({dy: this.state.dy + e.deltaY * -1, dx: this.state.dx + e.deltaX * -1})
  }

  render() {
    const {children, centerRef, ...rest} = this.props

    return (
      <HotKeys
        keyMap={{'remove': 'del', 'shiftie': 'shift+return'}}
        {...{
          className:
            css({flex: 1, display: 'flex'})
        } as any}
      >
        <CanvasStyle
          onWheel={this.pan}
          {...rest}
        >
          <Center
            innerRef={centerRef}
            dy={this.state.dy}
            dx={this.state.dx}
          >
            {children}
          </Center>
        </CanvasStyle>
      </HotKeys>
    )
  }
}