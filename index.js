const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// mongodb connection start

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjja2r0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        /*----------------------
            All Collection here
        -----------------------*/

        const productsCollection = client.db("buysale").collection("products");
        const cartProductsCollection = client.db("buysale").collection("cartProducts");
        const usersCollection = client.db("buysale").collection("users");


        /*-------------------------
            products Collection apis
        ---------------------------*/

        // send products to db
        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        // return products from db
        app.get("/products", async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { sellerEmail: req.query.email };
            }
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })

        // get product from db
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })


        /*----------------------------
            cart products Collection apis
        ------------------------------*/

        // send cart product to db
        app.post("/cartproducts", async (req, res) => {
            const cartProduct = req.body;
            const result = await cartProductsCollection.insertOne(cartProduct);
            res.send(result);
        })

        // get cart product from db
        app.get("/cartproducts", async (req, res) => {
            const result = await cartProductsCollection.find().toArray();
            res.send(result);
        })

        /*-------------------------
            users Collection apis
        ---------------------------*/

        // send users to db
        app.post("/users", async (req, res) => {
            const user = req.body;

            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already exits' });
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // get users from db
        app.get("/users", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // get isSeller user from db
        app.get("/seller", async (req, res) => {
            const email = req.query.email;
            const user = await usersCollection.findOne({ email: email });
            if (user?.role === "seller") {
                res.send(user);
            } else {
                return;
            }

        })

        // get isBuyer user from db
        app.get("/buyer", async (req, res) => {
            const email = req.query.email;
            const user = await usersCollection.findOne({ email: email });
            if (user?.role === "buyer") {
                res.send(user);
            } else {
                return;
            }

        })

        // get isAdmin user from db
        app.get("/admin", async (req, res) => {
            const email = req.query.email;
            const user = await usersCollection.findOne({ email: email });
            if (user?.role === "admin") {
                res.send(user);
            } else {
                return;
            }

        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Buy and sale project is running on!!");
})

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
})