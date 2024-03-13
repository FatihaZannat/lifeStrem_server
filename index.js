
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port =process.env.PORT || 4000

app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.1gd1ede.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const userCollection = client.db('lifeStream').collection('users')


    app.get('/users', async(req, res)=>{
        const {blood, district, upozila} = req.query

        const query = {}
        if(blood) query.blood = blood
        if(district) query.district = district
        if(upozila) query.upozila = upozila
        console.log(query);

        const result = await userCollection.find(query).toArray()
        console.log(result);
        res.send(result)
    })
    app.post('/users', async(req, res)=>{
        const data = req.body
        const result = await userCollection.insertOne(data)
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Blood is flowing!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})