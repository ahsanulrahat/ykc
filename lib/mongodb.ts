import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  console.warn('Warning: "MONGODB_URI" environment variable is not defined. Using mock database connection for build evaluation.');
  // Use a dummy local URI for build evaluation
  const dummyUri = 'mongodb://127.0.0.1:27017/dummy';
  client = new MongoClient(dummyUri, options);
  clientPromise = Promise.resolve(client);
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
export { client };

// Proactive indexing for query optimization and performance assurance
if (uri) {
  clientPromise.then(async (resolvedClient) => {
    try {
      const db = resolvedClient.db();
      await db.collection("posts").createIndex({ slug: 1 }, { unique: true });
      await db.collection("posts").createIndex({ createdAt: -1 });
      console.log("MongoDB indexes validated/created successfully.");
    } catch (e) {
      console.warn("Unable to create database indexes on initialization:", e);
    }
  });
}
