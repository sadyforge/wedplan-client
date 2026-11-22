import { MongoClient, MongoClientOptions, Db } from "mongodb";

const uri = process.env.MONGO_DB;
export const DB_NAME = "wedplan";

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isClientClosed(clientInstance: MongoClient | null | undefined): boolean {
  if (!clientInstance) return true;

  // Check if client has been closed via internal driver state
  const clientInternal = clientInstance as unknown as {
    s?: { hasBeenClosed?: boolean };
    topology?: {
      isDestroyed?: () => boolean;
      s?: { state?: string };
    };
  };

  if (clientInternal.s?.hasBeenClosed) {
    return true;
  }

  if (clientInternal.topology) {
    if (typeof clientInternal.topology.isDestroyed === "function" && clientInternal.topology.isDestroyed()) {
      return true;
    }
    if (clientInternal.topology.s?.state === "closed") {
      return true;
    }
  }

  return false;
}

function createNewClient(): { clientInstance: MongoClient; promise: Promise<MongoClient> } {
  if (!uri) {
    throw new Error("Invalid/Missing environment variable: 'MONGO_DB'");
  }

  const clientInstance = new MongoClient(uri, options);

  // Monitor client events
  clientInstance.on("error", (err) => {
    console.error("[MongoDB Client Error]:", err?.message || err);
  });

  clientInstance.on("topologyClosed", () => {
    console.warn("[MongoDB Topology]: Closed. Resetting cached instance.");
    if (globalThis._mongoClient === clientInstance) {
      globalThis._mongoClient = undefined;
      globalThis._mongoClientPromise = undefined;
    }
  });

  const promise = clientInstance.connect().catch((err) => {
    console.error("[MongoDB Connection Error]:", err?.message || err);
    if (globalThis._mongoClient === clientInstance) {
      globalThis._mongoClient = undefined;
      globalThis._mongoClientPromise = undefined;
    }
    throw err;
  });

  return { clientInstance, promise };
}

export function getClient(): MongoClient {
  if (!globalThis._mongoClient || isClientClosed(globalThis._mongoClient)) {
    const { clientInstance, promise } = createNewClient();
    globalThis._mongoClient = clientInstance;
    globalThis._mongoClientPromise = promise;
  }
  return globalThis._mongoClient;
}

export function getClientPromise(): Promise<MongoClient> {
  if (!globalThis._mongoClientPromise || isClientClosed(globalThis._mongoClient)) {
    const { clientInstance, promise } = createNewClient();
    globalThis._mongoClient = clientInstance;
    globalThis._mongoClientPromise = promise;
  }
  return globalThis._mongoClientPromise;
}

export function getDb(name = DB_NAME): Db {
  return getClient().db(name);
}

export async function connectToDatabase(name = DB_NAME): Promise<{ client: MongoClient; db: Db }> {
  const connectedClient = await getClientPromise();
  return { client: connectedClient, db: connectedClient.db(name) };
}

// Proxied client that always delegates to a healthy, active MongoClient instance.
// If client.close() is called, the cached instance is cleared so subsequent operations
// automatically obtain a fresh connection instead of failing with MongoTopologyClosedError.
export const client = new Proxy({} as MongoClient, {
  get(_target, prop, receiver) {
    const activeClient = getClient();
    if (prop === "close") {
      return async (...args: Parameters<MongoClient["close"]>) => {
        try {
          return await activeClient.close(...args);
        } finally {
          if (globalThis._mongoClient === activeClient) {
            globalThis._mongoClient = undefined;
            globalThis._mongoClientPromise = undefined;
          }
        }
      };
    }
    const val = Reflect.get(activeClient, prop, receiver);
    return typeof val === "function" ? val.bind(activeClient) : val;
  },
});

// Proxied Db that always resolves against the active, healthy client.
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const activeDb = getDb();
    const val = Reflect.get(activeDb, prop, receiver);
    return typeof val === "function" ? val.bind(activeDb) : val;
  },
});

// Eagerly initiate connection if MONGO_DB is defined in the current runtime
let clientPromise: Promise<MongoClient>;
if (uri) {
  clientPromise = getClientPromise();
} else {
  clientPromise = Promise.reject(new Error("Missing MONGO_DB environment variable"));
  clientPromise.catch(() => {});
}

export default clientPromise;
