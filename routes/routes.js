const Book = require('../services/services');
const worker = require('../worker/worker')

const getBooks =  async (req, res) => {
    try {
        const books = await Book.find({})
        res.status(200).json(books)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
module.export = getBooks;


const postBooks = async (req, res) => {
    try{
        const book = req.body;
        await addBookToQueue(book);
        res.json({ message: 'Book creation job added' });
    } catch {
        res.status(500).json({
            message: 'Error while posting the book',
        })
    }
}
module.export = postBooks;