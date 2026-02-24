const mongoose = require("mongoose");

const globalCache = global.mongooseConnection || {
  conn: null,
  promise: null
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(uri, {
      autoIndex: true
    });
  }

  globalCache.conn = await globalCache.promise;
  global.mongooseConnection = globalCache;
  return globalCache.conn;
};

module.exports = connectDB;
