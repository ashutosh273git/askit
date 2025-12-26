import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number
}
const connection: ConnectionObject = {isConnected: 0}

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