import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

//middleware for parsing body as json
app.use(express.json());

//middleware for handling cors
//first way: allow all origin with default cors 
// app.use(cors());

//second way: allow custom origins
app.use(
    cors({
        origin: "http://localhost:3000",
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
    })
);

app.get( '/', (request, response) =>{
    console.log(request);
    return response.status(234).send('Welcome to Mern Stack Tutorial');
});

app.use('/books', booksRoute);

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log('App connected to Database');
        app.listen(PORT, ()=>{
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });