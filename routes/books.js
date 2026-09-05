const express = require("express");
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");


const router = express.Router();

/**
 * Route: /books
 * Method:GET
 * Description: Get all the list of books in the system
 * Access: Public
 * Parameters: None
 */

router.get('/',(req,res)=>{
  res.status(200).json({
    success: true,
    data:books
  })
}) 


/**
 * Route: /users/:id
 * Method:GET
 * Description: Get a user by their ID
 * Access: Public
 * Parameters: id
 */

router.get('/:id',(req,res)=>{
 // for a specific user we use below 2 lines here we are finding id by users 
    const {id} =req.params;
    const book = books.find((each)=>each.id === id)
    if(!book){
      res.status(404).json({
        success:false,
        message: `User Not found for id ${id}`
      })
    }
     res.status(200).json({
    success: true,
    data: book                
  })
})

/**
 * Route: /books/:id
 * Method:POST
 * Description: Create a user by their ID
 * Access: Public
 * Parameters: id
 */
router.post('/',(req,res)=>{
    //req.body should have the following fields
    const {id,name,author,genre,price,publisher} = req.body;

    // Check if all th requirment fields are present
    if(!id||!name||!author||!genre||!price||!publisher){
        return res.status(400).json({
            success:false,
            message:"Please provide all the required fields"
        })
    }

// Check if the books already exists
const book = books.find((each)=>each.id === id)
    if(book){
      res.status(404).json({
        success:false,
        message: `Book Already Exists with id: ${id}`
      })
    }

    // Add the new book to the books array
    books.push({id,name,author,genre,price,publisher});

    res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: {id,name,author,genre,price,publisher}
    })
})


/**
 * Route: /books/:id
 * Method:PUT
 * Description: Create a user by their ID
 * Access: Public
 * Parameters: id
 */
router.put('/:id',(req,res)=>{
    //req.body should have the following fields
    const {id} = req.params;
    const {data} = req.body;

// Check if the books already exists
const book = books.find((each)=>each.id === id)
    if(!book){
     return res.status(404).json({
        success:false,
        message: `Book Already Exists with id: ${id}`
      })
    }
//   Update the book details
// object.assign(book,data);

// Or
const updatedBook = books.map((each)=>{
  if(each.id === id){
    return{...each, ...data};
  }
  return each;
})
res.status(200).json({
    success: true,
    message: "Book Updated Success",
    data:updatedBook
})
})


/**
 * Route: /books/id:
 * Method:DELETE
 * Description: Deleting a user by their ID
 * Access: Public
 * Parameters: ID
 */

router.delete('/:id',(req,res)=>{
   const {id} = req.params;

  //  Check if the user exists
  const book = books.find((each)=>each.id === id)
  if(!book){
    return res.status(404).json({
      success: false,
      message: `Book not found for id: ${id}`
    })
  }

  // if user exists, filer it out from the users array
  const updatedUsers = books.filter((each)=>each.id !== id)    // if the id is not equal to id

  res.status(200).json({
    success: true,
    data: updatedUsers,
    message: "Book Deleted Successfully "
  })
});

/**
 * Route: /books/issued/for-users
 * Method:GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: none
 */

router.get('/issued/for-users',(req,res)=>{
  // const issuedBook = books.filter((each)=> each.issued == true);

const userWithIssuedBooks = users.filter((each)=>{
  if(each.issuedBook){
    return each;
  }
})

const issuedBook = [];

userWithIssuedBooks.forEach((each)=>{
  const book = books.find((book)=>book.id ===each.issuedBook)

  book.issuedBy = each.name;
  book.issuedDate = each.issueDate;
  book.returnDate = each.returnDate;

  issuedBook.push(book)
})

if(!issuedBook === 0){
  return res.status(404).json({
    success: false,
    message: "No Book issued yet"
  })
}

  res.status(200).json({
    success:true,
    data: issuedBook
  })
})


module.exports = router;