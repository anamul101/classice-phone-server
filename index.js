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
        app.post('/category',async(req,res)=>{
          const addProduct=req.body;
          console.log(addProduct);
          const results =await productsCollection.insertOne({products:addProduct});
          res.send(results);
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
        app.delete('/bookings/:id', async(req,res)=>{
          const id = req.params.id;
          const query={_id:ObjectId(id)};
          const deletproducts =await bookingsCollection.deleteOne(query);
          res.send(deletproducts);
        })
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
        app.get('/users', async(req,res)=>{
          let query = {};
        if(req.query.role){
            query={
                role:req.query.role
            }
        }
        const cursor = usersCollection.find(query);
        const role = await cursor.toArray();
        res.send(role);
        });
        app.delete('/users/:id', async(req,res)=>{
          const id = req.params.id;
          const query={_id:ObjectId(id)};
          const deleteUser =await usersCollection.deleteOne(query);
          res.send(deleteUser);
        });
        app.put('/users/:id', async (req, res) => {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) }
          const options = { upsert: true };
          const updatedDoc = {
              $set: {
                  role: 'admin'
              }
          }
          const result = await usersCollection.updateOne(filter, updatedDoc, options);
          res.send(result);
      });
        app.get('/users/seller/:email', async (req, res) => {
          const email = req.params.email;
          const query = { email }
          const user = await usersCollection.findOne(query);
          res.send({ isSeller: user?.role === 'seller' });
      })
      //   app.get('/users/buyer/:email', async (req, res) => {
      //     const email = req.params.email;
      //     const query = { email }
      //     const user = await usersCollection.findOne(query);
      //     res.send({ isBuyer: user?.role === 'buyer' });
      // })
      // app.get('/users/admin/:email', async (req, res) => {
      //   const email = req.params.email;
      //   const query = { email }
      //   const user = await usersCollection.findOne(query);
      //   res.send({ isAdmin: user?.role === 'admin' });
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