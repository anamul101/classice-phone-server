const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middelwear
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.apqupzl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const productsCollection = client.db("ClassicePhoneDB").collection('Products2');
        app.get('/category',async(req,res)=>{
          const query = {};
          const results = await productsCollection.find(query).toArray();
          res.send(results)
        })
        app.get('/category/:id', async(req,res)=>{
          const id=req.params.id;
          const query={_id:ObjectId(id)};
          const singleProducts = await productsCollection.findOne(query);
          res.send(singleProducts)
        })
        // app.get('/products',async(req,res)=>{
        // let query = {};
        // if(req.query.category){
        //     query={
        //         category:req.query.category
        //     }
        // }
        // const cursor = productsCollection.find(query);
        // const products = await cursor.toArray();
        // res.send(products)
        // })
    }
    finally{

    }
}
run().catch(console.log)
app.get('/', (req, res) => {
  res.send('Classice phone server is running!')
})

app.listen(port, () => {
  console.log(`classice phone server on port ${port}`)
})