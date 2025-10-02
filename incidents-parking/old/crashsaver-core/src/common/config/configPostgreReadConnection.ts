import { Sequelize } from "sequelize";
import { Subject, Observable } from "rxjs";

// Dependencias

import dotenvFlow from "dotenv-flow";

// Configuraciones
dotenvFlow.config({
  silent: true,
});

class PostgreReadConnection {
  public static instance: PostgreReadConnection;
  public client!: Sequelize;
  private _statusConnection = new Subject<boolean>();
  public statusConnection: Observable<boolean>;
  public status: boolean = false;
  private postgreDB = process.env.POSTGRE_DB as string;
  private postgreUser = process.env.POSTGRE_USER as string;
  private postgrePass = process.env.POSTGRE_PASS as string;
  private postgreHost = process.env.POSTGRE_HOST as string;
  private postgrePort = 6565;

  constructor() {
    this.statusConnection = this._statusConnection.asObservable();
    this.init();
  }

  public static getInstance(): PostgreReadConnection {
    if (!PostgreReadConnection.instance) {
      PostgreReadConnection.instance = new PostgreReadConnection();
    }

    return PostgreReadConnection.instance;
  }

  private async init(): Promise<void> {
    await this.connection();
  }

  public async connection(): Promise<Sequelize> {
    try {
      this.client = new Sequelize({
        database: this.postgreDB,
        username: this.postgreUser,
        password: this.postgrePass,
        host: this.postgreHost,
        port: this.postgrePort,
        dialect: "postgres",
      });

      if (this.client) {
        console.log("Base de datos de lectura online");
      }

      this.setCompleteConnection();
      this.status = true;
      return this.client;
    } catch (error) {
      this.setErrorConnection(false);
      this.status = false;
      throw error;
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
}

export default PostgreReadConnection;
