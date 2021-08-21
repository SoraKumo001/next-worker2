type WorkerType = { [P: string]: (...args: any) => any }

const initWorker = (worker: Worker): Promise<Worker> => {
    return new Promise((resolve) => {
        worker.addEventListener(
            "message",
            () => {
                resolve(worker);
            },
            { once: true }
        );
    });
}
const exec = <T extends WorkerType>(worker: Worker, name: keyof T, ...value: Parameters<T[keyof T]>): Promise<ReturnType<T[keyof T]>> => {
    return new Promise(resolve => {
        worker.addEventListener("message", (result) => {
            resolve(result.data)
        }, { once: true })
        worker.postMessage({ type: name, value });
    })
}
export const createWorker = <T extends WorkerType>(builder: () => Worker, limit = 5) => {
    let workers = 0
    const unuses: Worker[] = []
    const jobs: any = []
    const execute = async <K extends keyof T>(name: K, ...value: Parameters<T[K]>): Promise<ReturnType<T[K]>> => {
        return new Promise(async (resolve) => {
            let worker: Worker | undefined = undefined;
            if (workers < limit) {
                worker = await initWorker(builder())
                workers++
             }
            if (!worker)
                worker = unuses.pop()
            if (worker) {
                resolve(await exec(worker, name, ...value))
                while (jobs.length) {
                    const { resolve, name, value } = jobs.shift()
                    resolve(await exec(worker, name, ...value))
                }
                unuses.push(worker)
            } else
                jobs.push({ resolve, name, value })

        })
    }
    return execute
}
export const createWorkerMap = <T extends { [key: string]: (...args: any) => unknown }>(WorkerProc: T) => {
    const worker = self as unknown as Worker;
    worker.addEventListener("message", (e: MessageEvent) => {
        const proc = WorkerProc[e.data.type as keyof T]
        if (proc) {
            worker.postMessage(proc(...e.data.value));
        }
    });
    worker.postMessage({ type: "init" });
    return WorkerProc
}