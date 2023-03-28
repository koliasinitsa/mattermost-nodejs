const express = require('express'); // Подключаем фреймворк Express
const mongoose = require('mongoose'); // Подключаем библиотеку для работы с MongoDB

const {getBooks, postBooks} = require('./routes/routes')

const app = express(); // Создаем объект приложения на базе Express

app.use(express.json()); // Подключаем middleware для обработки JSON-запросов

// Подключаемся к MongoDB
mongoose.connect('mongodb://localhost/books', { useNewUrlParser: true }); // Подключаемся к базе данных "books" на локальном сервере MongoDB
const db = mongoose.connection; // Получаем объект соединения с базой данных
db.on('error', console.error.bind(console, 'connection error:')); // Обработчик ошибок при подключении к базе данных
db.once('open', function() { // Обработчик успешного подключения к базе данных
  console.log('Connected to MongoDB');
});


app.get('/books', getBooks);
app.post('/books', postBooks);



  
// Запускаем сервер на порту 3000
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
