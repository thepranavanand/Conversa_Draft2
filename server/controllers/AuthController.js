import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
const maxAge = 3*24*60*60*1000;


const createToken = (email, userId) => {
    return jwt.sign({email,userId}, process.env.JWT_KEY, {expiresIn:maxAge});
};

// export const signup = async (request, response, next)=>{
//     try{
//         const {email, password}= request.body;
//         if(!email || !password){
//             return response.status(400).send("Email and Password is required")
//         }
//         const user  = await User.create({email, password});
//         response.cookie("jwt", createToken(email,user.id),{
//             maxAge,
//             secure:true,
//             sameSite:"None",
//         });
//         return response.status(201).json({user:{
//             id: user.id,
//             email: user.email,
//             profileSetup: user.profileSetup,
//         },
//     });
//     }catch(error){
//         console.log({error});
//         return response.status(500).send("Internal Server Error");
//     }

// }

export const signup = async (request, response, next)=>{
    try{
        const {email, password}= request.body;
        console.log("Signup attempt for:", email);
        
        if(!email || !password){
            return response.status(400).send("Email and Password is required")
        }
        const user = await User.create({email, password});
        console.log("User created:", user.id);
        
        const token = createToken(email, user.id);
        response.cookie("jwt", token, {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({user:{
            id: user.id,
            email: user.email,
            profileSetup: user.profileSetup,
        }});
    }catch(error){
        console.error("Signup error:", error);
        if(error.code === 11000) {
            return response.status(400).send("Email already exists");
        }
        return response.status(500).json({
            error: "Internal Server Error",
            details: error.message
        });
    }
}

// export const login = async (request, response, next)=>{
//     try{
//         const {email, password}= request.body;
//         if(!email || !password){
//             return response.status(400).send("Email and Password is required")
//         }
//         const user  = await User.findOne({email});
//         if(!user){
//             return response.status(404).send("User with given email not found.")
//         }
//         const auth = await compare(password, user.password);
//         if(!auth){
//             return response.status(400).send("Password is incorrect.")
//         }
//         response.cookie("jwt", createToken(email,user.id),{
//             maxAge,
//             secure:true,
//             sameSite:"None",
//         });
//         return response.status(200).json({user:{
//             id: user.id,
//             email: user.email,
//             profileSetup: user.profileSetup,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             image: user.image,
//             color: user.color,
//         },
//     });
//     }catch(error){
//         console.log({error});
//         return response.status(500).send("Internal Server Error");
//     }
export const login = async (request, response, next)=>{
    try{
        const {email, password}= request.body;
        console.log("Login attempt for:", email); // Debug log

        if(!email || !password){
            return response.status(400).send("Email and Password is required")
        }

        const user = await User.findOne({email});
        console.log("Found user:", user ? "yes" : "no"); // Debug log

        if(!user){
            return response.status(404).send("User with given email not found.")
        }

        const auth = await compare(password, user.password);
        console.log("Password match:", auth ? "yes" : "no"); // Debug log

        if(!auth){
            return response.status(400).send("Password is incorrect.")
        }

        const token = createToken(email, user.id);
        console.log("Token created:", token ? "yes" : "no"); // Debug log

        response.cookie("jwt", token, {
            maxAge,
            secure: true,
            sameSite: "None",
        });

        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            },
        });
    } catch(error) {
        console.error("Login error details:", error); // Better error logging
        return response.status(500).json({
            error: "Internal Server Error",
            details: error.message
        });
    }
}