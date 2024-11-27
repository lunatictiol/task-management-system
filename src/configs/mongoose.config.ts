import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export const connectDb = async ()=>{
    try {
      
        if(process.env.MONGO_URI){
        const conn = await mongoose.connect(process.env.MONGO_URI)
        
        console.log("Connected: " + `${conn.connection.db?.databaseName}`)
    }
    }
    catch(error){
        
        console.log("Error : " + error)
    
        
    }
    
}