import mongoose from 'mongoose';    

export const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_CONNECTIONSTRING);

        console.log("Kết nối DB thành công!");
    } catch (error) {
        console.error("Kết nối DB thất bại!", error);
        process.exit(1); //(1)exit with error (0) exit without thanh cong
    }
}