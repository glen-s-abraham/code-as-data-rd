const { MongoClient } = require("mongodb");
// MongoDB connection URL
const url = "mongodb://localhost:27017";

// MongoDB database and collection names
const dbName = "sample-db";
const collectionName = "users";

console.log(input);

// Sample data to be inserted
const sampleData = [
  { name: "John", age: 30 },
  { name: "Jane", age: 25 },
  { name: "Bob", age: 35 },
];

// Create a MongoDB client
async function connectToDatabase() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected to the MongoDB database");

    // Perform database operations here
    // Get the MongoDB database
    const db = client.db(dbName);
    // Get the collection
    const collection = db.collection(collectionName);
    const data = await collection.insertMany(sampleData);
    await client.close();
    console.log("Disconnected from the MongoDB database");
    return "data added"
  } catch (error) {
    console.error("Error connecting to the MongoDB database:", error);
  }
}

connectToDatabase();

output['res'] = 'test' 