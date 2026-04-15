import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/next_blog_db";
mongoose.set("strictPopulate", false);

if (!global.mongooseConnection) {
  global.mongooseConnection = { conn: null, promise: null };
}

export default async function connectMongo() {
  if (global.mongooseConnection.conn) {
    return global.mongooseConnection.conn;
  }

  if (!global.mongooseConnection.promise) {
    global.mongooseConnection.promise = mongoose.connect(uri).then((mongooseInstance) => mongooseInstance);
  }

  global.mongooseConnection.conn = await global.mongooseConnection.promise;
  return global.mongooseConnection.conn;
}
