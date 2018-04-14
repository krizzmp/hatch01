class Vector2d {
  y: number;
  x: number;
  constructor(a: point, b: point) {
    this.x = b.x - a.x;
    this.y = b.y - a.y;
  }
  magnitude() {
    // noinspection JSSuspiciousNameCombination
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  angle() {
    return Math.atan2(this.y, this.x) * 180 / Math.PI;
  }
}
type point = { x: number; y: number };
export const vec = (pos1: point, pos2: point): Vector2d => {
  return new Vector2d(pos1, pos2);
};
