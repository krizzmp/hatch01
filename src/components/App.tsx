import * as React from 'react'
import { Composer } from '../ReComposeClass'
import { getVal } from 'react-redux-firebase'
import * as _ from 'lodash'
import * as style from '../styles'
import Todo from './Todo'

let cuid = require('cuid')

export type TodoType = {
  id: string,
  x: number, y: number,
  dx: number, dy: number,
  name: string
}

const Line = (p) => (
  <style.Line {...p}/>
)

let P0 = new Composer()
  .firebaseConnect(['todos', 'lines'])
  .connect(({firebase}) => ({
    todosRaw: getVal(firebase, 'data/todos/', {}),
    linesRaw: getVal(firebase, 'data/lines/', {}),
  }))
  .withStateHandlers(
    () => ({
      dx: 0, dy: 0,
      dragging: undefined as TodoType | undefined,
      draggingInitPos: undefined as { x: number, y: number } | undefined,
    }),
    {
      pan: ({dx, dy}) => (e) => {
        e.preventDefault()
        if (e.ctrlKey) {
          e.stopPropagation()
        }
        return {dy: dy + e.deltaY * -1, dx: dx + e.deltaX * -1}
      },
      dragStart: () => (e, todo) => ({
        dragging: todo,
        draggingInitPos: {x: e.clientX, y: e.clientY}
      }),
      onDragEnd: (s, p) => (e: MouseEvent) => {
        e.stopPropagation()
        if (!s.dragging) {
          return {}
        }
        let todo = p.todosRaw[s.dragging.id]
        let el = document.querySelector('[data-box-id]:hover')
        if (el) {
          let dropedOnId = el.getAttribute('data-box-id')

          let newLine = {id: cuid(), b1: dropedOnId, b2: todo.id}
          p.firebase.set(`lines/${newLine.id}`, newLine)
          p.firebase.update(`todos/${todo.id}`, {dx: 0, dy: 0})
        } else {
          p.firebase.update(`todos/${todo.id}`, {
            x: todo.x + todo.dx, y: todo.y + todo.dy,
            dx: 0, dy: 0,
          })
        }
        return ({dragging: undefined, draggingInitPos: undefined})
      }
    })
  .withHandler((p) => ({
    createTodo: (e, canvas) => {
      let bcr = canvas.getBoundingClientRect()
      const x = e.clientX - (bcr.left)
      const y = e.clientY - (bcr.top)
      const id = cuid()
      p.firebase.set(`todos/${id}`, {
        id, name: 'fsd',
        x, y, dx: 0, dy: 0
      })
    },
    onMouseMove: (e) => {
      if (p.dragging && p.draggingInitPos) {
        const dx = e.clientX - p.draggingInitPos.x
        const dy = e.clientY - p.draggingInitPos.y
        p.firebase.update(`todos/${p.dragging.id}`, {dx, dy})
      }
    },

  }))
  .render((p) => {
    let $canvas
    return (
      <React.Fragment>
        <style.Canvas
          onDoubleClick={(e) => p.createTodo(e, $canvas)}
          onWheel={p.pan}
          onMouseMove={p.onMouseMove}
          onMouseUp={p.onDragEnd}
        >
          <style.Todos
            innerRef={(input) => $canvas = input}
            dy={p.dy}
            dx={p.dx}
          >
            {_.values(p.linesRaw).map((line) =>
              <Line
                key={line.id}
                b1={p.todosRaw[line.b1]}
                b2={p.todosRaw[line.b2]}
              />
            )}
            {_.values(p.todosRaw).map((todo) =>
              <Todo
                key={todo.id}
                todo={todo}
                onDragStart={p.dragStart}
                dragging={!!p.dragging && todo.id === p.dragging.id}
              />
            )}

          </style.Todos>
        </style.Canvas>
      </React.Fragment>
    )
  })

export default P0