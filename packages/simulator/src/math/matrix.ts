import { MathError } from "./error";
import type { Matrix, MatrixLike, Vector, VectorLike } from "./types";

export function matSize(a: MatrixLike): [height: number, width: number] {
  return [a.length, a[0].length];
}

export function matMake(height: number, width: number): Matrix {
  const m = new Array<Vector>(height);
  for (let i = 0; i < height; i++) {
    m[i] = vecMake(width);
  }
  return m;
}

export function matClear(m: Matrix, x = 0): void {
  for (const row of m) {
    row.fill(x);
  }
}

export function matCopy(src: MatrixLike, dst: Matrix): void {
  const [aHeight, aWidth] = matSize(src);
  const [bHeight, bWidth] = matSize(dst);
  if (aHeight !== bHeight || aWidth !== bWidth) {
    throw new MathError();
  }
  for (let i = 0; i < aHeight; i++) {
    dst[i].set(src[i]);
  }
}

export function matMultiplyMat(a: MatrixLike, b: MatrixLike): Matrix {
  const [aHeight, aWidth] = matSize(a);
  const [bHeight, bWidth] = matSize(b);
  if (aWidth !== bHeight) {
    throw new MathError();
  }
  const c = matMake(aHeight, bWidth);
  for (let i = 0; i < aHeight; i++) {
    for (let j = 0; j < bWidth; j++) {
      let x = 0;
      for (let k = 0; k < aWidth; k++) {
        x += a[i][k] * b[k][j];
      }
      c[i][j] = x;
    }
  }
  return c;
}

export function matMultiplyVec(a: MatrixLike, b: VectorLike): Vector {
  const [height, width] = matSize(a);
  if (width !== b.length) {
    throw new MathError();
  }
  const c = vecMake(height);
  for (let i = 0; i < height; i++) {
    let x = 0;
    for (let j = 0; j < width; j++) {
      x += a[i][j] * b[j];
    }
    c[i] = x;
  }
  return c;
}

export function vecMake(size: number): Vector {
  return new Float64Array(size);
}

export function vecClear(v: Vector, x = 0): void {
  v.fill(x);
}

export function vecCopy(src: VectorLike, dst: Vector): void {
  if (src.length !== dst.length) {
    throw new MathError();
  }
  dst.set(src);
}

export function swapRows<T>(
  m: { [index: number]: T },
  a: number,
  b: number,
): void {
  const t = m[a];
  m[a] = m[b];
  m[b] = t;
}

export function swapColumns<T>(
  m: ArrayLike<{ [index: number]: T }>,
  size: number,
  a: number,
  b: number,
): void {
  for (let i = 0; i < size; i++) {
    const row = m[i];
    const t = row[a];
    row[a] = row[b];
    row[b] = t;
  }
}
