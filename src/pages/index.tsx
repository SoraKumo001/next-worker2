import { useState } from "react";
import { createWorker } from "worker-lib";
import type { WorkerTest } from "../libs/worker-test";

// Create an instance to execute the Worker
// execute("function name",... parameter) to start the Worker
const execute = createWorker<WorkerTest>(
  () => new Worker(new URL("../libs/worker-test", import.meta.url)),
  5 // Maximum parallel number
);

const Page = () => {
  const [values, setValues] = useState<(number | string)[]>([]);
  const [a, setA] = useState(300);
  const [b, setB] = useState(100);
  return (
    <div>
      <form>
        <input name="a" value={a} onChange={(e) => setA(Number(e.currentTarget.value))} />
        <input name="b" value={b} onChange={(e) => setB(Number(e.currentTarget.value))} />
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "running"]);
            //Calling a Worker
            const result = await execute("add", a, b);
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          Add
        </button>
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "running"]);
            //Calling a Worker
            const result = await execute("add2", String(a), String(b));
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          Add(String)
        </button>
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "running"]);
            //Calling a Worker
            const result = await execute("sub", a, b);
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          Sub
        </button>
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "running"]);
            //Calling a Worker
            const result = await execute("mul", a, b);
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          Mul
        </button>
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "running"]);
            //Calling a Worker
            const result = await execute("error", a, b).catch((e) => e);
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          Error
        </button>
      </form>
      {values.map((v, index) => (
        <div key={index}>{v}</div>
      ))}
    </div>
  );
};
export default Page;
