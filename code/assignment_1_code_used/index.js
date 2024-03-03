require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http')
const dataRouter = require('./dataRouter.js');
require('express-async-errors');
require('dotenv').config()


const PORT = 3000;
const mysimbdp = express();

// middleware declaration
mysimbdp.use(bodyParser.json());
mysimbdp.use(bodyParser.urlencoded({ extended: true }));
mysimbdp.use(cors());
mysimbdp.use(express.json());

console.log('connecting to mysimbdp-coredms (MongoDB)');

//mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017/`)
mongoose.connect(`mongodb://root:password@mongo:27017/`)
  .then(() => {
    console.log('connected to mysimbdp-coredms (MongoDB)')
  })
  .catch((error) => {
    console.log('error connection to mysimbdp-coredms (MongoDB):', error.message)
  });

// Route
mysimbdp.use('/data', dataRouter);

const server = http.createServer(mysimbdp)

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});