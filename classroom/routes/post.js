const express = require("express");

const router = express.Router();

// Index route
router.get("/",(req,res) =>{
    res.send("This Posts index route");
});

// Show route
router.get("/:id",(req,res) =>{
    res.send("This Posts is show");
});

// New route
router.post("/new",(req,res) =>{
    res.send("This Posts is New");
});

// Delete route
router.delete("/:id",(req,res) =>{
    res.send("This Posts is to delete");
})

module.exports = router;