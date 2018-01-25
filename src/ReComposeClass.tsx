import { firebaseConnect, withFirebase } from 'react-redux-firebase'
import { withProps, withStateHandlers } from 'recompose'
import { SFC } from 'react'
import { connect } from 'react-redux'

export class Composer<OP = {}, OG = OP> {
  og: OG
  op: OP
  hoc

  constructor(hoc: any = undefined) {
    this.hoc = hoc
  }

  _Hoc(fn: any) {
    if (this.hoc) {
      return (comp) => this.hoc(fn(comp))
    } else {
      return (comp) => fn(comp)
    }
  }

  withFirebase(): Composer<OP & { firebase: any }, OG> {
    return new Composer<OP & { firebase: any }, OG>(
      this._Hoc(withFirebase)
    )
  }

  firebaseConnect(paths: string[]): Composer<OP & { firebase: any }, OG> {
    return new Composer<OP & { firebase: any }, OG>(
      this._Hoc(firebaseConnect(paths))
    )
  }

  connect<P>(matp: (s: any, p: OP) => P): Composer<OP & P, OG> {
    return new Composer<OP & P, OG>(
      this._Hoc(connect(matp))
    )
  }

  connect2<P, A>(matp: (s: any, p: OP) => P,
                 mdtp: (d: any, p: OP) => A): Composer<OP & P & A, OG> {
    return new Composer<OP & P & A, OG>(
      this._Hoc(connect(matp, mdtp))
    )
  }

  withProps<P>(fn: (p: OP) => P): Composer<OP & P, OG> {
    return new Composer<OP & P, OG>(this._Hoc(withProps(fn)))
  }

  withHandler<P>(fn: (p: OP) => P): Composer<OP & P, OG> {
    return new Composer<OP & P, OG>(
      this._Hoc(withProps(fn))
    )
  }

  withStateHandlers<TState, Q>(createProps: (p: OP) => TState,
                               stateUpdaters: Q): Composer<OP & TState & {[key in keyof Q]: any}, OG> {
    return new Composer<OP & TState & {[key in keyof Q]: any}, OG>(
      this._Hoc(withStateHandlers(createProps, stateUpdaters as any))
    )
  }

  render(SomeComponent: SFC<OP>): SFC<OG> {
    return this.hoc(SomeComponent)
  }
}