import express from "express";

const ruoter = express.Router()

ruoter.post("/api/users/signout",(req,res)=>{
    req.session = null;
    res.send({});
})

export {ruoter as signoutRouter};