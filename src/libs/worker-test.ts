import { createWorkerMap } from "./worker-lib";

const add = (a: number, b: number) => {
  for (let i = 0; i < 1000000000; i++); //無駄に負荷をかける
  return a + b
}
const add2 = (a: string, b: string) => {
  for (let i = 0; i < 1000000000; i++); //無駄に負荷をかける
  return a + b
}
const sub = (a: number, b: number) => {
  for (let i = 0; i < 1000000000; i++); //無駄に負荷をかける
  return a - b
}
const mul = (a: number, b: number) => {
  for (let i = 0; i < 1000000000; i++); //無駄に負荷をかける
  return a * b
}

// Workerで使用可能にするための初期化作業
const map = createWorkerMap({ add, add2, sub, mul })
// 型のみexportする
export type WorkerMap = typeof map


