const express = require("express");
const {users} = require ("./data/users.json")


// importing routers
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");


const app = express();

const PORT = 8081;

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Home page:-)"
    })
})


app.use("/users",usersRouter);
app.use("/books",booksRouter);

/**
 * Route: /users
 * Method:GET
 * Description: Get all the list of users in the system
 * Access: Public
 * Parameters: None
 */

app.get('/users',(req,res)=>{
  res.status(200).json({
    success: true,
    data: users
  })
})

/**
 * Route: /users/:id
 * Method:GET
 * Description: Get a user by their ID
 * Access: Public
 * Parameters: id
 */

app.get('/users/:id',(req,res)=>{
 // for a specific user we use below 2 lines here we are finding id by users 
    const {id} =req.params;
    const user = users.find((each)=>each.id === id)
    if(!user){
      res.status(404).json({
        success:false,
        message: `User Not found for id ${id}`
      })
    }
     res.status(200).json({
    success: true,
    data: user                
  })
})


/**
 * Route: /users/
 * Method:POST
 * Description: Create/Register a new user
 * Access: Public
 * Parameters: none
 */
app.post('/users',(req,res)=>{
  // req.body should have the following fields
    const {id,name,surname,email,subscriptionType,subscriptionDate}=req.body;     // req.body is a parameter

    // Check of all the requirment fields are present
    if(!id||!name||!surname|| !email || !subscriptionType ||!subscriptionDate){
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields"
      })
    }
  //  Check if the user alredy exists
    const user = users.find((each)=>each.id === id)    // checking if the id is as same as user's id
    if(user){
      return res.status(409).json({
        success: false,
        message:`User Already Exists with id:${id}`
      })
    }
  // If all checks pass, create the user
  // and push it to the users array
    users.push({id,name,surname,email,subscriptionType,subscriptionDate})

    res.status(201).json({
      success:true,
      message: "User Created Successfully"
    })
  
  
  })


  /**
 * Route: /users/id:
 * Method:PUT
 * Description: Updating a user by their ID
 * Access: Public
 * Parameters: ID
 */

 app.put('/users/:id',(req,res)=>{
     const {id} = req.params;
     const {data}= req.body;

    // Check if the user exists
    const user = users.find((each)=>each.id === id)   // if we not getting any user then say below lines
    if(!user){
      return res.statusCode(404).json({
        success: false,
        message: `User not found for id: ${id}`
      })
    }

    // we can use github copilot which tells the next line
    // Object.assign(user,data);


    // but this can also be used to understand
    // With Spread Operator
    const updatredUser = users.map((each)=>{
      if(each.id === id){
        return {
          ...each,
          ...data,
        }
      }
      return each
    })
    res.status(200).json({
      success: true,
      data: updatredUser,
      message: "User Updated Successfully"
    })
 }) 

 /**
 * Route: /users/id:
 * Method:DELETE
 * Description: Deleting a user by their ID
 * Access: Public
 * Parameters: ID
 */

app.delete('/users/:id',(req,res)=>{
   const {id} = req.params;

  //  Check if the user exists
  const user = users.find((each)=>each.id === id)
  if(!user){
    return res.status(404).json({
      success: false,
      message: `User not found for id: ${id}`
    })
  }

  // if user exists, filer it out from the users array
  const updatedUsers = users.filter((each)=>each.id !== id)    // if the id is not equal to id

  res.status(200).json({
    success: true,
    data: updatedUsers,
    message: "UserDeleted Successfully "
  })
})


// app.all('*',(req,res)=>{                 // it will handle any other methods
//  res.status(500).json({
//   message:"Not Build Yet"
//  })
// })
  app.listen(PORT,()=>{
    console.log(`Server listning and running on http://localhost:${PORT}`);
    
  })