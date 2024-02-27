require('dotenv').config()
const express = require('express');
const app = express();

const cors = require('cors');

const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')

const web = require('./router/web')

require('./db/conn')
// cors
app.use(cors())

// json middleare
app.use(bodyParser.json({ extended: true }))

//middle ware
app.use(bodyParser.urlencoded({ extended: true }))

// use public folder
app.use('/public', express.static('public'));

// cookie middleware
app.use(cookieParser());

app.use('/', web)

app.listen(process.env.PORT, () => {
    console.log("app is running")
})