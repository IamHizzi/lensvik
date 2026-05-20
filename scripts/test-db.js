const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://khizer:khk12345@lensvik.pddcwrt.mongodb.net/?appName=lensvik";

async function run() {
    const client = new MongoClient(uri);
    try {
        console.log("Connecting...");
        await client.connect();
        console.log("Connected successfully to server");
        
        // Let's check databases
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        console.log("Databases found on server:");
        for (const dbInfo of dbs.databases) {
            console.log(`- ${dbInfo.name} (${dbInfo.sizeOnDisk} bytes)`);
            const db = client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                console.log(`    * ${col.name}: ${count} documents`);
            }
        }
    } catch (err) {
        console.error("Error during execution:", err);
    } finally {
        await client.close();
    }
}
run();
