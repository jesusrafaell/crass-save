import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

export class MongoConnection {
  public client!: MongoClient;
  constructor(
     private Mongo_URI = process.env.MONGO_URI || "",
     private MONGO_DB = process.env.MONGO_DB || ""
  ) { }

  public async connetion(): Promise<MongoClient> {
    try {
      this.client = await MongoClient.connect(this.Mongo_URI, {});
      console.log('Conected DB mongo');
      return this.client;
    } catch (error) {
      console.error('Error DB mongo conection:', error);
      throw new Error('Error DB mongo conection:');
    }
  }

  public async connectionMongo() {
    try {
      await mongoose.connect(
        `${this.Mongo_URI}/${this.MONGO_DB}`
      );
      console.log('Conected DB Mongo');
    } catch (error) {
      console.error('Error DB mongo conection:', error);
      throw new Error("Error DB mongo")
    }
  }
}
