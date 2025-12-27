import mongoose from "mongoose";
import { MongoClient } from "mongodb";

type ConnectionObject = {
  isConnected?: number
}
const connection: ConnectionObject = {isConnected: 0}
const client = new MongoClient(process.env.MONGO_URI!);


async function connectDB(): Promise<void>{
  if(connection.isConnected){
    console.log("Already connected to database")
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI || '', {})
    connection.isConnected = db.connections[0].readyState
    console.log("DB Connected Successfully")
  } catch (error) {
    console.log("DB connection failed", error)
    process.exit(1)
  }
}

export default connectDB
export const db = client.db("test"); 