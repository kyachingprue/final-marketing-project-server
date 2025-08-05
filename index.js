const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhw49.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );

    const productCollection = client
      .db('productMarketing')
      .collection('products');
    const cartCollection = client.db('productMarketing').collection('carts');

    //product API collection
    app.get('/products', async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    //Cart API collection
    app.get('/carts', async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    app.post('/carts', async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Final Marketing project server is running soon...');
});

app.listen(port, () => {
  console.log(`Final Project Server is running port: ${port}`);
});
