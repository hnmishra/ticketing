import express,{Request,Response} from "express";
import { body } from "express-validator";
import { validateRequest } from "@hnticketing/common";
import { User } from "../../models/user";
import { BadRequestError } from "@hnticketing/common";
import { Password } from "../services/password";
import jwt from 'jsonwebtoken';

const ruoter = express.Router()

ruoter.post("/api/users/signin",
    [
        body("email")
            .isEmail()
            .withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password")
    ],
    validateRequest,

    async (req:Request,res:Response)=>{
        const {email,password} = req.body;
        const existingUser =await User.findOne({email});
        if(!existingUser){
            throw new 
            BadRequestError("Invalid credentials");
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);

        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // Generate JWT
        const userJwt = jwt.sign(
            {
                email: existingUser.email
            },
            process.env.JWT_KEY!
        );

        // Store it on session object
        req.session = {
            jwt: userJwt
        };
        console.log("Sign in succeeded");
        res.status(200).send({ existingUser, message: "Sign in succeeded" });
})
//router name is wrong
//but export as signinRouter so will have no impact
export {ruoter as signinRouter};