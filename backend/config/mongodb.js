import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB Connected');
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)

    } catch (error) {
        console.log("MongoDB Error:");
        console.log(error);
    }
}

export default connectDB;

//Mongodb atlas password : TCY3eLy2XRsKXlw6