const express = require("express");

const router = express.Router();

// Users Routes

// Index route
router.get("/",(req,res) =>{
    res.send("This is users index route");
})

// Show route
router.get("/:id",(req,res) =>{
    res.send("This is users show");
})

// New route
router.post("/new",(req,res) =>{
    res.send("This is users New");
})

// Delete route
router.delete("/:id",(req,res) =>{
    res.send("This is users to delete");
})

module.exports = router;