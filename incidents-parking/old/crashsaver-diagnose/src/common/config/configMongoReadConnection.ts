import { MongoClient, ObjectId } from "mongodb";
import { Subject, Observable } from "rxjs";

// Dependencias

import dotenvFlow from "dotenv-flow";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

class MongoReadConnection {
  public static instance: MongoReadConnection;
  public client!: MongoClient;
  private _statusConnection = new Subject<boolean>();
  public statusConnection: Observable<boolean>;
  public status: boolean = false;
  private URLConnection: string;

  constructor() {
    this.statusConnection = this._statusConnection.asObservable();
    this.URLConnection = process.env.MONGO_URL_CONNECTION_READ || "";
    this.init();
  }

  public static getInstance(): MongoReadConnection {
    if (!MongoReadConnection.instance) {
      MongoReadConnection.instance = new MongoReadConnection();
    }

    return MongoReadConnection.instance;
  }

  private async init(): Promise<void> {
    await this.connection();
  }

  public async connection(): Promise<MongoClient> {
    try {
      this.client = await MongoClient.connect(this.URLConnection, {});

      if (this.client) {
        console.log("Base de datos de lectura online");
      }

      this.setCompleteConnection();
      this.status = true;
      return this.client;
    } catch (error) {
      this.setErrorConnection(false);
      this.status = false;
      throw new Error("error.message");
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

export default MongoReadConnection;
