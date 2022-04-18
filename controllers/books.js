const Books = require("../model/books");

const getAllBooks = async (req, res) => {
    try {
        const bookObject = {};

        const { name, description, genre } = req.query;

        if (name) {

            bookObject.name = { $regex: name, $options: "i" };
        }
        if (description) {

            bookObject.description = { $regex: description, $options: "i" };
        }
        if (genre) {
            bookObject.genre = {$regex: genre, $options: "i"};
        }

        let result = Books.find(bookObject);

        result = result.sort("createdAt"); 

        const books = await result;

        res
            .status(200)
            .json({ message: "success", books, total: books.length });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};


const getBook = async (req, res) => {
    try {

        const { id:bookId } = req.params;

            const book = await Books.findById({ _id: bookId });
            if(book){
                return res.status(200).json({ message: "success", book });
            }

        res.status(401).json({ message: "failed" });

    } catch (error) {
        res.status(500).json({ message: error });
    }
};



const addBook = async (req, res) => {
    try {
        const { name, description, genre, author, price } = req.body;

        if (
            name === "" ||
            description === "" ||
            author === "" ||
            price === "" ||
            genre === ""
        ) {
            return res.send(401).json({ message: "all data of book must be provided" });
        }

        const newBook = await Books.create(req.body);

        res.status(200).json({ newBook, message: `${name} is added to ${genre}` });

    } catch (error) {
        res.status(505).json({ message: error });
    }
};



const updateBook = async (req, res) => {
    try {
        const { id: bookId } = req.params;
        const { name, description, genre, author, price } = req.body;

            const updateBook = await Books.findByIdAndUpdate(
                { _id: bookId },
                { name, description, genre, author, price },
                { new: true, runValidators: true }
            );

            if(updateBook){

                const {name}= updateBook;

                return res.status(200).json({
                    updateBook,
                    message: `${name} is updated`,
                });
            }

        res.status(401).json({ message: "cannot update data" });

    } catch (error) {
        res.status(505).json({ message: error });
    }

};



const deleteBook = async (req, res) => {
    try {
        const { id: bookId } = req.params;

        const deletedBook = await Books.findByIdAndRemove({ _id: bookId });

        const { name } = deletedBook;

        if (deletedBook) {

            return res
                .status(200)
                .json({ message: "success", message: `${name} is deleted` });
        }

        res.status(401).json({ message: "cannot delete data" });
    } catch (error) {
        res.status(505).json({ message: error });
    }
};



module.exports = { getBook, getAllBooks, addBook, updateBook, deleteBook };
