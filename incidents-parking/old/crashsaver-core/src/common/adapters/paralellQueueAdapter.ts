import Queue from "better-queue";
import { Subject, Observable } from "rxjs";

export class ParalellQueueAdapter<T> {
  private queue!: Queue;
  private tasks: Observable<T>[];
  private concurrent: number = 20;
  private maxTimeout: number = 20000;

  // status queue
  private _statusFinishTasks = new Subject<boolean>();
  public statusFinishTasks: Observable<boolean>;

  // get result for queue
  private _resultWorker = new Subject<any | T>();
  public resultWorker: Observable<any | T>;

  constructor(tasks: Observable<T>[], concurrent: number, maxTimeout: number) {
    this.concurrent = concurrent;
    this.maxTimeout = maxTimeout;
    this.statusFinishTasks = this._statusFinishTasks.asObservable();
    this.resultWorker = this._resultWorker.asObservable();
    this.tasks = tasks;
    this.createWorkQueue();
    this.listenFinishAllTask();
  }

  private createWorkQueue() {
    this.queue = new Queue(
      async (task: Observable<T>, callback) => {
        try {
          const result = await task.toPromise();

          if (result instanceof Error) {
            callback(result, null);
          } else {
            callback(null, result);
          }
        } catch (error) {
          callback(error, null);
        }
      },
      {
        concurrent: this.concurrent,
        maxTimeout: this.maxTimeout,
      },
    );
  }

  private listenFinishAllTask() {
    this.queue.on("drain", () => {
      this.setStatusFinishTasks(true);
    });
  }

  private setStatusFinishTasks(status: boolean) {
    this._statusFinishTasks.next(status);
  }

  private setErrorFinishTasks(error: any) {
    this._statusFinishTasks.error(error);
  }

  private setResultWorker(result: any | T) {
    this._resultWorker.next(result);
  }

  private setErrorWorker(error: any) {
    this._resultWorker.error(error);
  }

  public execute() {
    this.tasks.forEach((task) => {
      this.queue.push(task, (error: any, result: any | T) => {
        if (error) {
          this.setErrorWorker(error);
          this.setErrorFinishTasks(error);
        } else {
          this.setResultWorker(result);
        }
      });
    });
  }
}
