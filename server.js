const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

//
app.use(cors());
app.use(express.json());

//api start
app.get("/", async (req, res) => {
    res.send("server is running!");
  });

  //api link
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.go6jz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function run() {
    try {
      await client.connect();
      const database = client.db("car-bd-shop");
      const user_collection = database.collection("users");
      const product_collection = database.collection("allCars");
      const order_collection = database.collection("orders");
    //   const review_collection = database.collection("review");
  
      app.post('/shop', async(req,res)=>{
        const product= req.body;
        console.log('hit the post api', product);
      })

//all products
    app.get("/shop", async (req, res) => {
        const cursor = product_collection.find({});      
         const products = await cursor.toArray();
         res.send(products)
    });

    //booking page
    app.post("/placeorder",async(req,res)=>{
      const result =await order_collection.insertOne(req.body);
          res.send(result)
      })
    //placeorder single
    app.get("/placeorder/:id", async(req,res)=>{
        const id = req.params.id;
        console.log('getting specie', id)
        const query = {_id:ObjectId(id)};
        const bookingproduct = await product_collection.findOne(query);
        res.json(bookingproduct)
    })

    //mypackage
    app.get( "/myorder" , async (req,res)=>{
      const result =await  order_collection.find({}).toArray()
     res.send(result)
  })
  //manage all api
  app.get("/manageplan",async(req,res)=>{
    const manageresult = await order_collection.find({}).toArray()
    res.json( manageresult);
})

  //delete
  app.delete('/delete/:id', async(req,res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const deleteresult = await order_collection.deleteOne(query)
    console.log('deteted user with id',deleteresult)
    res.json( deleteresult)
})

/// new code
 app.get('/userorder',async(req,res)=>{
  //  console.log("email");
   const email = req.query.email;
   const query = { email:email };
   const result = await  order_collection.find(query).toArray()
   res.send(result)
 })

  app.post('/adduser', async(req,res)=>{
    // console.log(req.body);
    const result = await user_collection.insertOne(req.body)
    console.log(result);
  })

  app.put('/updateuser', async(req,res)=>{
    const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
        },

      };
      const result = await user_collection.updateOne(filter, updateDoc, options);
      console.log(result);
  })

  app.post('/addadmin',async(req,res)=>{
    const roll= 'admin'
    const filter = { email: req.query.email };
    const updateDoc = {
      $set: {
        roll: roll
      },
    };
    const result = await user_collection.updateOne(filter, updateDoc);
    console.log(result);
  })

  app.get('/isadmin',async(req,res)=>{
    
    const email = req.query.email;
    console.log(email);
   const query = { email:email };
   const result = await  user_collection.findOne(query)
   let isadmin = false;
   if(result?.roll=== 'admin'){
     isadmin=true
   }
   res.send(isadmin)
  })

} finally {
    // await client.close();
  }
}
  run().catch(console.dir);

  app.listen(port,()=>{console.log("server is running this on port", port)})