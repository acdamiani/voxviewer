export type WorkerSupport = 0 | 1 | 2;

export function getWorkerSupport(): 0 | 1 | 2 {
  if (window.Worker) {
    let supportsModule = false;

    const tester = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      get type() {
        supportsModule = true;
      },
    };

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      new Worker('data:,', tester).terminate();
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return supportsModule ? 2 : 1;
    }
  } else {
    return 0;
  }
}
