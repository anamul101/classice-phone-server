const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const jwt = require('jsonwebtoken');

// middelwear
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.apqupzl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const productsCollection = client.db("ClassicePhoneDB").collection('Products2');
        const bookingsCollection = client.db("ClassicePhoneDB").collection('bookings2');
        const usersCollection = client.db("ClassicePhoneDB").collection('users2');
        const addProductsCollection = client.db("ClassicePhoneDB").collection('addProducts');
      
        
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
        // addProducts
        app.post('/addproducts',async(req,res)=>{
          const addProduct=req.body;
          console.log(addProduct)
          const results =await addProductsCollection.insertOne(addProduct);
          res.send(results);
        });
        app.get('/addproducts', async(req,res)=>{
          const query = {};
          const results = await addProductsCollection.find(query).toArray();
          res.send(results)
        });
        app.get('/allproducts/advatise', async (req, res) => {
          let query = {}
          if (req.query.role) {
              query = {
                  role: req.query.role
              }
          }
          const result = await addProductsCollection.find(query).toArray()
          res.send(result)
      })
        app.put('/addproducts/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const updatedDoc = {
              $set: {
                  role: 'available'
              }
          }
          const result = await addProductsCollection.updateOne(query, updatedDoc);
          res.status(403).send(result);
      })
      app.delete('/addproducts/:id', async(req,res)=>{
        const id = req.params.id;
        const query={_id:ObjectId(id)};
        const deletproducts =await addProductsCollection.deleteOne(query);
        res.send(deletproducts);
      })
        // jwt 
        app.get("/jwt", async (req, res) => {
          const email = req.query.email;
          const query = { email: email };
          const user = await usersCollection.findOne(query);
          if (user) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
              expiresIn: "7d",
            });
            return res.send({ accessToken: token });
          }
          res.status(403).send({ accessToken: "" });
          res.send({ accessToken: "token" });
        });
    
        app.post("/users", async (req, res) => {
          const user = req.body;
          const result = await usersCollection.insertOne(user);
          res.send(result);
        });
        // End Poient of bookings
        app.post('/bookings',async(req,res)=>{
          const booking = req.body;
          const results = await bookingsCollection.insertOne(booking);
          res.send(results);
        })
        
        app.get("/bookings", verifyJWT, async (req, res) => {
          const email = req.query.email;
          const decodedEmail = req.decoded.email;
          if (email !== decodedEmail) {
            return res.status(403).send({ message: "forbidden access" });
          }
          const query = { email: email };
          const bookings = await bookingsCollection.find(query).toArray();
          res.send(bookings);
        });
        app.put('/bookings/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const updatedDoc = {
              $set: {
                paid: 'paid'
              }
          }
          const result = await bookingsCollection.updateOne(query, updatedDoc);
          res.status(403).send(result);
      })
        app.delete('/bookings/:id', async(req,res)=>{
          const id = req.params.id;
          const query={_id:ObjectId(id)};
          const deletproducts =await bookingsCollection.deleteOne(query);
          res.send(deletproducts);
        })

        // end point of users
        app.post('/users', async(req,res)=>{
          const user = req.body;
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
          const query = { _id: ObjectId(id) };
          const updatedDoc = {
              $set: {
                verify: 'verify'
              }
          }
          const result = await usersCollection.updateOne(query, updatedDoc);
          res.status(403).send(result);
      })
        app.put('/users/admin/:id',async (req, res) => {
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
          res.send({ isSeller: user?.role === 'Seller' });
      })
        app.get('/users/buyer/:email', async (req, res) => {
          const email = req.params.email;
          const query = { email }
          const user = await usersCollection.findOne(query);
          res.send({ isBuyer: user?.role === 'Buyer' });
      })
      app.get('/users/admin/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email }
        const user = await usersCollection.findOne(query);
        res.send({ isAdmin: user?.role === 'admin' });
      });
      app.get('/user/:id', async(req,res)=>{
        const id=req.params.id;
        const query={email:id};
        const result=await usersCollection.findOne(query);
        res.send(result);
      })
  
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