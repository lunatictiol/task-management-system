import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export const connectDb = async ()=>{
    console.log("Heree")
    try {
      
        if(process.env.DB_URL){
        const conn = await mongoose.connect(process.env.DB_URL)
        
        console.log("Connected: " + `${conn.connection.db?.databaseName}`)
    }
    }
    catch(error){
        
        console.log("Error : " + error)
    
        
    }
    
}