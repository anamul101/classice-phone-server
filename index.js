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
        const bookingsCollection = client.db("ClassicePhoneDB").collection('bookings2');
        const usersCollection = client.db("ClassicePhoneDB").collection('users2');
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
        // End Poient of bookings
        app.post('/bookings',async(req,res)=>{
          const booking = req.body;
          const results = await bookingsCollection.insertOne(booking);
          res.send(results);
        })
        app.get('/bookings', async(req,res)=>{
          const email = req.query.email;
          // console.log('accestoken', req.headers.authorization)
          // const decodedEmail=req.decoded.email;
          // if(email !== decodedEmail){
          //   return res.status(403).send({message: 'forbidden access'});
          // }
          const query = {email: email};
          const bookings = await bookingsCollection.find(query).toArray();
          res.send(bookings);
        });
        // app.get('/bookings',async(req,res)=>{
        // let query = {};
        // if(req.query.email){
        //     query={
        //         email:req.query.email
        //     }
        // }
        // const cursor = bookingsCollection.find(query);
        // const products = await cursor.toArray();
        // res.send(products)
        // })

        // end point of users
        app.post('/users', async(req,res)=>{
          const user = req.body;
          console.log(user);
          const results = await usersCollection.insertOne(user);
          res.send(results);
        });
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