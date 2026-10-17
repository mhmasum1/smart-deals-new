require("dotenv").config()
const express =require("express")
const cors =require("cors")

const app=express();

const {MongoClient, ObjectId}=require("mongodb")

const port=process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const client=new MongoClient(process.env.MONGO_URI)

async function connecToMongodb() {
 
  try{
     await client.connect();

const db =client.db("smart-deals-new");
const productsCollection = db.collection("products");


// POST

app.post("/products",async(req,res)=>{
  const newProduct=req.body;
  const result= await productsCollection.insertOne(newProduct);
  res.send(result)
})

// DELETE
app.delete("/products/:id",async(req,res)=>{
  const id =req.params.id;
  const query= {_id: new ObjectId(id)}
  const result =await productsCollection.deleteOne(query);
  res.send(result);
})

// GET

app.get("/products",async(req,res)=>{
  const cursor= productsCollection.find();
  const result=await cursor.toArray();
  res.send(result);
})

// UPDATE
app.patch("/products/:id",async(req,res)=>{

  const id=req.params.id;
  const updatedProduct=req.body;
  const query={_id:new ObjectId(id)}
  const update={
    $set:{
      name:updatedProduct.name,
      price:updatedProduct.price
    }
  }
const options={};
const result=await productsCollection.updateOne(query,update,options);
res.send(result);

})









     console.log("Mongodb is connected successfully");
     return client;

  }catch(err){
    console.error("MongoDB is not connected",err);
    throw err;
  }

}

app.get("/",(req,res)=>{
  res.send("Now Masum is the right track")
})

async function serverStart(){
 
  try{
     await connecToMongodb();

     app.listen(port,()=>{
      console.log(`Server is running on port ${port}`)
     })


  }catch(err){
    console.error("Server is failed to stard",err);
    process.exit(1);
  }
 
}

serverStart();

