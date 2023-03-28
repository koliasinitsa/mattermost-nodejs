const { Worker } = require('bullmq');
const Book = require('../services/services')

// Объявляем обработчик для выполнения задачи добавления книги в MongoDB
const processBookQueue = async (job) => {
    const book = job.data; // Получаем данные задачи
    const newBook = new Book(book); // Создаем новый объект книги на базе полученных данных
    await newBook.save(); // Сохраняем новую книгу в базу данных
};
// Подключаем обработчик "processBookQueue" к очереди "book"
const worker = new Worker('book', processBookQueue);
module.export = worker;