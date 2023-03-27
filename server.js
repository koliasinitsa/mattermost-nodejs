const express = require('express'); // Подключаем фреймворк Express
const mongoose = require('mongoose'); // Подключаем библиотеку для работы с MongoDB
const { Queue } = require('bullmq'); // Подключаем библиотеку для работы с очередями на базе Redis
const { Worker } = require('bullmq');


const app = express(); // Создаем объект приложения на базе Express

app.use(express.json()); // Подключаем middleware для обработки JSON-запросов

// Подключаемся к MongoDB
mongoose.connect('mongodb://localhost/books', { useNewUrlParser: true }); // Подключаемся к базе данных "books" на локальном сервере MongoDB
const db = mongoose.connection; // Получаем объект соединения с базой данных
db.on('error', console.error.bind(console, 'connection error:')); // Обработчик ошибок при подключении к базе данных
db.once('open', function() { // Обработчик успешного подключения к базе данных
  console.log('Connected to MongoDB');
});

// Создаем новую очередь для обработки задач с именем "book"
const bookQueue = new Queue('book', {
    connection: {
      host: 'localhost',
      port: 6379, // Подключаемся к локальному серверу Redis на стандартном порту 6379
    },
});



// Создаем модель для коллекции книг
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
});

const Book = mongoose.model('Book', bookSchema); // Создаем новую модель на базе схемы "bookSchema"

// Объявляем обработчик для выполнения задачи добавления книги в MongoDB
const processBookQueue = async (job) => {
    const book = job.data; // Получаем данные задачи
    const newBook = new Book(book); // Создаем новый объект книги на базе полученных данных
    await newBook.save(); // Сохраняем новую книгу в базу данных
};

const worker = new Worker('book', processBookQueue);

// Подключаем обработчик "processBookQueue" к очереди "book"
bookQueue.on('completed', (job) => {
    console.log(`Job completed with result ${job.returnvalue}`);
});

bookQueue.on('failed', (job, err) => {
    console.log(`Job failed with error ${err}`);
});

bookQueue.add('book', { title: 'Book 1', author: 'Author 1' });

// Объявляем обработчик, который будет добавлять новые задачи в очередь "book"
const addBookToQueue = async (book) => {
    await bookQueue.add('book', book); // Добавляем новую задачу в очередь "book"
};

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({})
        res.status(200).json(books)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.post('/books', async (req, res) => {
    try{
        const book = req.body;
        await addBookToQueue(book);
        res.json({ message: 'Book creation job added' });
    } catch {
        res.status(500).json({
            message: 'Error while posting the book',
        })
    }
});



  
// Запускаем сервер на порту 3000
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
