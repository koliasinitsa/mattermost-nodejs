const mongoose = require('mongoose'); // Подключаем библиотеку для работы с MongoDB

// Создаем модель для коллекции книг
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
});

const Book = mongoose.model('Book', bookSchema); // Создаем новую модель на базе схемы "bookSchema"
module.export = Book;