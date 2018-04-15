import * as R from "ramda";
export class Axjs<T> {
  private arr: T[];
  constructor(arr: T[]) {
    this.arr = arr;
  }
  map<S>(fn: (el: T, index: number, array: T[]) => S): Axjs<S> {
    return new Axjs(this.arr.map(fn));
  }
  filter(fn: (el: T) => boolean): Axjs<T> {
    return new Axjs(R.filter(fn, this.arr));
  }
  partition(fn: (el: T) => boolean): Axjs<Axjs<T>> {
    return new Axjs(R.partition(fn, this.arr).map(xs => new Axjs(xs)));
  }

  sortBy(fn: (el: T) => number): Axjs<T> {
    return new Axjs(R.sortBy(fn, this.arr));
  }
  find(fn: (el: T) => boolean): T | undefined {
    return R.find(fn, this.arr);
  }
  head(): T | undefined {
    return R.head(this.arr);
  }
  notNil(): Axjs<NonNullable<T>> {
    const xs = R.filter(R.complement(R.isNil), this.arr) as NonNullable<T>[];
    return new Axjs(xs);
  }
  asArray(): T[] {
    return this.arr;
  }
}
