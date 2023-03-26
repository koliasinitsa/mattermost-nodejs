const express = require('express');
const mongoose = require('mongoose');
const { Queue } = require('bullmq');

const app = express();

app.use(express.json());

// подключимся к MongoDB
mongoose.connect('mongodb://localhost/books', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});


const bookQueue = new Queue('book', {
    connection: {
      host: 'localhost',
      port: 6379,
    },
});
  
//   добавление задачи в очередь
const addBookToQueue = async (book) => {
    await bookQueue.add('book', book);
};




// Создадим модель для коллекции книг
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
});

const Book = mongoose.model('Book', bookSchema);



// обработчик для выполнения задачи добавления книги в MongoDB
const processBookQueue = async (job) => {
    const book = job.data;
    const newBook = new Book(book);
    await newBook.save();
};
//   назначение обработчика для задачи в очереди
bookQueue.process('book', processBookQueue);

  

app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.send(books);
});



app.post('/books', async (req, res) => {
    const { title, author } = req.body;
  
    const job = await queue.add('createBook', {
        title,
        author,
    });
  
    res.json({ message: 'Book creation job added', jobId: job.id });
});

queue.process('createBook', async (job) => {
    const { title, author} = job.data;
    const book = new Book({
      title,
      author,
    });
    await book.save();
});  

app.listen(3000, () => {
    console.log('Server started on port 3000');
});