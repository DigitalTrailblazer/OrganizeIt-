import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL)
            .then(() => {
                console.log("DB CONNECTED SUCCESSFULLY !")
            })
    } catch (error) {
        console.error("DB CONNECTION ERROR:", error);
        process.exit(1)
    }
}

export default connectDB