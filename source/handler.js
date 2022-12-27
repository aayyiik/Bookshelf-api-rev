const {nanoid} = require('nanoid');

const books = require('./books');

//========================
//Kriteria 1
//Menyimpan inputan buku
//=========================
const addBookHandler = (request, h) => {
  const {  
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading, 
  } = request.payload;

  //validasi kolom nama//
  //Jika kolom nama tidak diisi//
  if(!name){
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. Mohon isi nama buku"
    });

    response.code(400);

    return response;
  }
 
  //validasi buku yang dibaca tidak boleh lebih dari halaman //
  if (readPage > pageCount) {

    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    });

    response.code(400);

    return response;
  }

  const id = nanoid(16);

  
let finished = false;
if (pageCount === readPage) {
  finished = true;
}

const insertedAt = new Date().toISOString();
const updatedAt = insertedAt;
 
  const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
 
  books.push(newBook);
 
  const isSuccess = books.filter((book) => book.id === id).length > 0;
 
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(400);
  return response;
};
//===============================
//Kriteria 2
//menampilkan seluruh buku
//===============================
 const getAllBooksHandler = (request, h) => {

  const {
    name,
    reading,
    finished
  } = request.query;

  //cari berdasarkan namanya
  const saveBook = [];
  if(name != null){
   const searchByName = String(name).toLowerCase();

      books.forEach((book) => {
        const nameBook = String(book.name).toLowerCase();

        if(nameBook.includes(searchByName)){
          saveBook.push(book);
        }
      });

      const response = h.response({
        "status": 'success',
        "data": {books: saveBook},
      });

      response.code(200);
      return response;

  }

  //cari berdasarkan sedang dibaca atau tidak//
  
  if(reading != null){
    if(reading === "1"){

      books.forEach((book) => {
        if(book.reading){
         saveBook.push(book);
        }
       });
   
       const response = h.response({
         "status": 'success',
         "data": {books: saveBook},
       });
   
       response.code(200);
       return response;
     }else{
   
       books.forEach((book) =>{
         if(!book.reading){
           saveBook.push(book);
         }
       });
       const response = h.response({
         "status": 'success',
         "data": {books: saveBook},
     });
     
     response.code(200);
     return response;

 }
}

//Cari berdasarkan sudah selesai dibaca atau belum//


if(finished != null){
  if(finished === '1'){
    
    book.forEach((book) => {
      if(book.finished){
        saveBook.push(book);
      }
    });
    const response = h.response({
      "status": 'success',
      "data": {books: saveBook},
    });

    response.code(200);
    return response;
  }else{
    books.forEach((book) => {
      if(!book.finished){
        saveBook.push(book);
      }
    });

    const response = h.response({
      "status": 'success',
      "data": {books: saveBook},
    });

    response.code(200);

    return response;
  }
}

//Mencari tanpa perlu parameter//
   const allBook = books.map((book) => {
      const { id, publisher } = book;
      return {
        id,
        name: book.name,
        publisher
      };
    });

    const response = h.response ({
      "status": 'success',
      "data": { books:allBook },
    });

    response.code(200)
    return response;

};

//========================================
//Kriteria 3
//Menampilkan buku berdasarkan id nya
//========================================

  const getBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if(book !== undefined){
      return {
        "status" : 'success',
        "data": {
          book
        },
      };
    }

    const response = h.response({
      "status": 'fail',
      "message": 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
  };

  //==========================
  //Kriteria 4
  //Menampilkan edit buku
  //==========================

    const editBookByIdHandler = (request, h) =>{
      const {id} = request.params;

      const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

      if(!name){
        const response = h.response({
          "status": 'fail',
          "message": "Gagal memperbarui buku. Mohon isi nama buku",
        });

        response.code(400);
        return response;
      }

      if (readPage > pageCount) {

        const response = h.response({
          "status": "fail",
          "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"        });
    
        response.code(400);
    
        return response;
      }

 
      const index = books.findIndex((b) => b.id === id);

      if(index !== -1){
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading, 
          updatedAt: new Date().toString(),
        };

        const response = h.response({
          "status": 'success',
          "message": 'Buku berhasil diperbarui',
        });

        response.code(200);
        return response;
      }
      
        const response = h.response({
          "status": 'fail',
          "message": "Gagal memperbarui buku. Id tidak ditemukan",
        });

        response.code(404);
        return response;
    };

    //===================
    //Kriteria 5
    //Menghapus Buku
    //===================
      const deleteBookByIdHandler = (request, h)=> {
        const {id} = request.params;

        const index = books.findIndex((book) => book.id === id);

        if(index !== -1){
          books.splice(index, 1);

          const response = h.response({
            status: 'success',
            message: "Buku berhasil dihapus",
          });

          response.code(200);
          return response;
        }

        const response = h.response({
          "status": 'fail',
          "message": "Buku gagal dihapus. Id tidak ditemukan",
        });

        response.code(404);
        return response;
      };


  module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };