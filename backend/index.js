import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Book } from "./models/bookModel.js"

const app = express();
app.use(express.json());
app.get( '/', (request, response) =>{
    console.log(request);
    return response.status(234).send('Welcome to Mern Stack Tutorial');
});

// route to save books in database

app.post('/books', async(request, response)=>{
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear){
            return response.status(400).send({ message: 'send all the required fields: title, author, publishYear'});

        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook);
        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//route to get all books from database
app.get('/books', async(request, response) => {
    try {
        const books = await Book.find({});
        
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//route to get a specific book from database
app.get('/books/:id', async(request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        
        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//route for updating a book
app.put('/books/:id', async (request, response) =>{
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear){
            
            return response.status(400).send({ message: 'send all the required fields: title, author, publishYear'});

        }
        const { id } = request.params;
        
        const result = await Book.findByIdAndUpdate(id, request.body);

        if(!result){
            return response.status(404).json({message: 'book not found'});
        }
        return response.status(200).send({message: 'Book update successfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

app.delete('/books/:id', async(request, response) =>{
    try {
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result){
            return response.status(404).json({messaage: 'Book not found'});
        }

        return response.status(200).send({message: 'book deleted successfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

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