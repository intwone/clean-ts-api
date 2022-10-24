import { MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,

  connect: async (uri: string): Promise<void> => {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParse: true,
      useUnifiedTopology: true,
    });
  },

  disconnect: async () => {
    await this.client.close();
  },
};
