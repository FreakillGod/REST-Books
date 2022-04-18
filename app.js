require('dotenv').config()

const express = require('express')
const cors= require('cors')

const app= express();
const PORT= 5000

const connectDB=require('./DB/mongo')
const pageNotFound=require('./middleware/pageNotFound')
const books= require('./routes/books')


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/v1/books',books)

app.get('/',(req,res)=>{
    res.send('<h1>Store API</h1> <a href="/api/v1/books">Books</a>')
})

app.use(pageNotFound)

const start=async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT,()=>console.log(`server is listening on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
   
}

start()