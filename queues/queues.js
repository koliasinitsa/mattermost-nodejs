const { Queue } = require('bullmq'); // Подключаем библиотеку для работы с очередями на базе Redis


// Создаем новую очередь для обработки задач с именем "book"
const bookQueue = new Queue('book', {
    connection: {
      host: 'localhost',
      port: 6379, // Подключаемся к локальному серверу Redis на стандартном порту 6379
    },
});




bookQueue.add('book', { title: 'Book 1', author: 'Author 1' });

// Объявляем обработчик, который будет добавлять новые задачи в очередь "book"
const addBookToQueue = async (book) => {
  await bookQueue.add('book', book); // Добавляем новую задачу в очередь "book"
};
module.export = addBookToQueue;