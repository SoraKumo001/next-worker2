import { useState } from "react";
import type { WorkerMap } from "../libs/worker-test";
import { createWorker } from "../libs/worker-lib";

// Worker実行用のインスタンスを作成
// execute("関数名",...パラメータ)でWorkerが起動する
const execute = createWorker<WorkerMap>(
  () => new Worker(new URL("../libs/worker-test", import.meta.url)),
  5 //最大並列数
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
            setValues([...values, "実行中"]);
            //Workerの呼び出し
            const result = await execute("add", a, b); 
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          足し算
        </button>
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "実行中"]);
            //Workerの呼び出し
            const result = await execute("add2", String(a), String(b));
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          足し算(文字列)
        </button>
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "実行中"]);
            //Workerの呼び出し
            const result = await execute("sub", a, b);
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          引き算
        </button>
        <button
          type="button"
          onClick={async () => {
            const index = values.length;
            setValues([...values, "実行中"]);
            //Workerの呼び出し
            const result = await execute("mul", a, b);
            setValues((values) => values.map((v, i) => (i === index ? result : v)));
          }}
        >
          かけ算
        </button>
      </form>
      {values.map((v, index) => (
        <div key={index}>{v}</div>
      ))}
    </div>
  );
};

export default Page;
