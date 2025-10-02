import { MongoClient, ObjectId } from "mongodb";
import { Subject, Observable } from "rxjs";

// Dependencias
import dotenvFlow from "dotenv-flow";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

class MongoWriteConnection {
  public static instance: MongoWriteConnection;
  public client!: MongoClient;
  private _statusConnection = new Subject<boolean>();
  public statusConnection: Observable<boolean>;
  public status: boolean = false;
  private URLConnection: string;

  constructor() {
    this.statusConnection = this._statusConnection.asObservable();
    this.URLConnection = process.env.MONGO_URL_CONNECTION_WRITE || "";
    this.init();
  }

  public static getInstance(): MongoWriteConnection {
    if (!MongoWriteConnection.instance) {
      MongoWriteConnection.instance = new MongoWriteConnection();
    }

    return MongoWriteConnection.instance;
  }

  private async init(): Promise<void> {
    await this.connection();
  }

  public async connection(): Promise<MongoClient> {
    try {
      this.client = await MongoClient.connect(this.URLConnection, {});

      if (this.client) {
        console.log("Base de datos de escritura online");
      }

      this.setCompleteConnection();
      this.status = true;
      return this.client;
    } catch (error: any) {
      this.setErrorConnection(error);
      this.status = false;
      throw new Error(error.message);
    }
  }

  // private setStatusConnection(value: boolean): void {
  //   this._statusConnection.next(value);
  // }

  private setCompleteConnection(): void {
    this._statusConnection.complete();
  }

  private setErrorConnection(error: any): void {
    this._statusConnection.error(error);
  }

  public convertObjectId(id: string): ObjectId {
    return new ObjectId(id);
  }
}

export default MongoWriteConnection;
