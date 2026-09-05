const express = require("express");
const {users} = require ("../data/users.json")


const router = express.Router();
/**
 * Route: /users
 * Method:GET
 * Description: Get all the list of users in the system
 * Access: Public
 * Parameters: None
 */

router.get('/',(req,res)=>{
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

router.get('/:id',(req,res)=>{
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
router.post('/',(req,res)=>{
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

 router.put('/:id',(req,res)=>{
     const {id} = req.params;
     const {data}= req.body;

    // Check if the user exists
    const user = users.find((each)=>each.id === id)   // if we not getting any user then say below lines
    if(!users){
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

router.delete('/:id',(req,res)=>{
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
});

/**
 * Route: /users/subscription-details/id:
 * Method:DELETE
 * Description: Get all the subscription-details of a user by their ID
 * Access: Public
 * Parameters: ID
 */
router.get('/subscription-details/:id',(req,res)=>{
   const {id} = req.params;

  //  Check if the user exists
  const user = users.find((each)=>each.id === id)
  if(!user){
    return res.status(404).json({
      success: false,
      message: `User not found for id: ${id}`
    })
  }
// Extract the subscription details
const getDateInDays = (data ='')=>{
  let date;
  if(data){
    date = new Date(data);
  }
  else{
    date = new Date();
  }

// To calcutale days
let days = Math.floor (date.getTime() /(1000 * 60 *60 *24));
return days;
}
const subscriptionType = (date) =>{
  if(user.subscriptionType ==="Basic"){
    date = date + 90
  }else if(user.subscriptionType ==="Standard"){
    date = date + 180
  } if(user.subscriptionType ==="Premium"){
    date = date + 365
  }
  return date;
}

// Subscription Expiration Calculation
// January 1, 1970 UTC // milliseconds

let returnDate = getDateInDays (user.returnDate);
let currentDate = getDateInDays();
let subscriptionDate = getDateInDays(user.subscriptionDate)
let subscriptionExpiration = subscriptionType(subscriptionDate)
  
const data ={
  ...user,
  subscriptionExpired: subscriptionExpiration < currentDate,
  subscriptionDaysLeft: subscriptionExpiration - currentDate,
  daysLeftForExpiration: returnDate - currentDate,
  returnDate: returnDate < currentDate ? "Book is overdue" : returnDate,
  fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200: 100: 0
}
  res.status(200).json({
    success: true,
    data: data
    
  })
});

// we need to export
module.exports = router;
// This is the users router for the liberary managment sys