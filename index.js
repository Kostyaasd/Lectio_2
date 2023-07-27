// Package Imports
import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express' 
import bodyParser from 'body-parser'
import router from './router/router.js'


// App Definition
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


  app.use('/api',router);
app.listen(process.env.PORT, () => console.log(`Running for my life on port ${process.env.PORT}.`));
  