const express = require('express');
require('dotenv').config();
const app = express();
var cors = require('cors')
require('./Database/database')();

const fileRoutes = require('./Routes/file.route');
const path = require('path');

const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')

};

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Acces-Control-Allow-Origin', '*');
    res.setHeader('Acces-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Acces-Contorl-Allow-Methods', 'Content-Type', 'Authorization');
    next();
})
app.use('/api/files', fileRoutes);
app.use('/files', fileRoutes);
app.use('/download', fileRoutes);

app.listen(`${process.env.PORT}`, () => {
    console.log(`Server is Listening on port ${process.env.PORT}`)
})