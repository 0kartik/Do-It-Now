import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

let mongod

export async function connectTestDb() {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
}

export async function closeTestDb() {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

export async function clearTestDb() {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}
