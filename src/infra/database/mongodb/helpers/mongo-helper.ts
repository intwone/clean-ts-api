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

  public static map(data: any): any {
    if (!data) return null;
    if (!Array.isArray(data)) {
      const { _id, ...dataWithoutId } = data;
      return { ...dataWithoutId, id: _id };
    }
    const mappedData = data.map((item: any) => {
      const { _id, ...dataWithoutId } = item;
      return { ...dataWithoutId, id: _id };
    });
    return mappedData;
  }
}
