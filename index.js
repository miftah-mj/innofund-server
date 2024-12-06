const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fh7he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const campaignnCollection = client
            .db("campaignDB")
            .collection("campaigns");
        const userCollection = client.db("campaignDB").collection("users");

        // Routes for CRUD operations
        // Get all campaigns
        app.get("/campaigns", async (req, res) => {
            const cursor = campaignnCollection.find({});
            const results = await cursor.toArray();
            res.send(results);
        });

        // get a campaign by id
        app.get("/campaigns/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await campaign.collection.findOne(query);
            res.send(result);
        });

        // Create a new campaign
        app.post("/campaigns", async (req, res) => {
            const newCampaign = req.body;
            const result = await campaignnCollection.insertOne(newCampaign);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("InnoFund is running...");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
