import { MongoClient } from 'mongodb';

export class MongoHelper {
  public static client: MongoClient | null = null;

  public static async connect(uri: string): Promise<MongoHelper | null> {
    if (!MongoHelper.client) {
      MongoHelper.client = await MongoClient.connect(uri);
    }
    return MongoHelper.client;
  }

  public static async disconnect() {
    await this.client?.close();
  }

  public static getCollection(name: string) {
    return this.client?.db().collection(name);
  }
}
