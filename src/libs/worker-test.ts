import { initWorker } from "worker-lib";

const add = (a: number, b: number) => {
  for (let i = 0; i < 1000000000; i++); //Overload unnecessarily
  return a + b
}
const add2 = (a: string, b: string) => {
  for (let i = 0; i < 1000000000; i++); //Overload unnecessarily
  return a + b
}
const sub = (a: number, b: number) => {
  for (let i = 0; i < 1000000000; i++); //Overload unnecessarily
  return a - b
}
const mul = (a: number, b: number) => {
  for (let i = 0; i < 1000000000; i++); //Overload unnecessarily
  return a * b
}

const error = (a: number, b: number) => {
  for (let i = 0; i < 1000000000; i++); //Overload unnecessarily
  throw new Error("throw")
  return  a + b;
}

// Initialization process to make it usable in Worker.
const map = initWorker({ add, add2, sub, mul, error })
// Export only the type
export type WorkerTest = typeof map


