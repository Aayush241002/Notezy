const connectToMongo = require('./db');
require('dotenv').config();
const express = require('express')
const cors = require("cors");
connectToMongo();

const app = express()
const port = process.env.PORT || 5000
app.use(cors());   // allows all origins

app.use(express.json())
app.use('/api/auth', require('./Routes/auth.js'))
app.use('/api/notes', require('./Routes/notes.js'))

app.listen(port, () => {
    console.log(`Example app listening on ${port}`)
})
