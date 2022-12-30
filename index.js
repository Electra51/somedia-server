const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iohfkju.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('somedia').collection('users');
        const myPostCollection = client.db('somedia').collection('myPosts')
        const commentsCollection = client.db('somedia').collection('comments');
        const aboutCollection = client.db('somedia').collection('about');
        const aboutUpdateCollection=client.db('somedia').collection('aboutUpdate');


       // Save user email & generate JWT
    app.put('/user/:email', async (req, res) => {
        const email = req.params.email
        const user = req.body
  
        const filter = { email: email }
        const options = { upsert: true }
        const updateDoc = {
            $set: user
        }
        const result = await usersCollection.updateOne(filter, updateDoc, options)
  
        const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
          expiresIn: '1d',
        })
        console.log(result)
        res.send({ result, token })
    })
    app.get('/myPosts', async (req, res) => {
        const query = {};
        const result  = await myPostCollection.find(query).toArray();
        res.send(result)
    })
        
        app.get('/myPosts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const postCollection = await myPostCollection.findOne(query);
            res.send(postCollection);
    })

        app.post('/myPosts', async (req, res) => {
            const myPost = req.body;
            const result = await myPostCollection.insertOne(myPost);
            res.send(result)
        })

        app.get('/comments', async (req, res) => {
            const query = {};
            const result  = await commentsCollection.find(query).toArray();
            res.send(result)
        })

        //comment korte
        app.post('/comments', async (req, res) => {
            const comments = req.body;
            console.log(comments);
            const result = await commentsCollection.insertOne(comments);
            res.send(result);
        })

        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { id };
            
            
            const result = await commentsCollection.findOne(query);
            res.send(result);
        })

        app.post('/aboutMe', async (req, res) => {
            const aboutMe = req.body;
            console.log(aboutMe);
            const result = await aboutCollection.insertOne(aboutMe);
            res.send(result);
        })

        app.get('/aboutMe', async (req, res) => {
            const query = {};
            const result = await aboutCollection.find(query).toArray();
            res.send(result)
           
        })

        app.get('/aboutMe/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            // const email = req.params.email;
            // const query = {email : email}
            const abouts = await aboutCollection.findOne(query);
            res.send(abouts);
        })
           
    //     app.put('/aboutMe/:email', async (req, res) => {
    //         const email = req.params.email;
    //         const filter = { email:email };
    //         const aboutMe = req.body;
    //         const option = { upsert: true }
            
    //         const updatedAboutMe = {
    //             $set: {
    //                 university : aboutMe.university,
    // status : aboutMe.status,
    // address : aboutMe.address,
    // designation : aboutMe.designation
                    
    //             }
    //         }

    //         const result = await aboutCollection.updateOne(filter,updatedAboutMe,option);
    //         res.send(result);
    //     })
    app.patch('/aboutMe/:email', verifyJWT, async (req, res) => {
        const id = req.params.id;
        const status = req.body.status
        const query = { _id: ObjectId(id) }
        const updatedDoc = {
            $set: {
                status: status
            }
        }
        const result = await aboutCollection.updateOne(query, updatedDoc);
        res.send(result);
    })

        
        
    }
    finally {
        
    }
}
run().catch(console.log);




app.get('/', async (req, res) => {
    res.send('soMedia server is running');
})

app.listen(port, () => console.log(`soMedia running on ${port}`))