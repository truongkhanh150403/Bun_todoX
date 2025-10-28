import express  from 'express';
import tasksRoute from './routes/tasksRouters.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


const app = express();

//middleware
app.use(express.json()); //middleware phân tích cú pháp các yêu cầu(request)
//  sau đó mới đi tiếp tới Router chính(đặt chúng vào req.body)

if(process.env.NODE_ENV !== "production"){
  app.use(cors({origin: "http://localhost:5173"})); //cho phép các yêu cầu từ frontend localhost:5173

}


app.use("/api/tasks", tasksRoute);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() =>{ //Kết nối cơ sở dữ liệu trước khi bắt đầu run máy chủ
  app.listen(PORT, () => {
  console.log(`Server bắt đầu trên cổng 5001. ${PORT}`);  
  });
});



