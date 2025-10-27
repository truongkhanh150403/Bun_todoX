import express from 'express';
import {    getAllTasks, 
            createTask, 
            updateTask, 
            deleteTask } from '../controller/tasksController.js';

const router = express.Router();

router.get("/", getAllTasks); // Sử dụng hàm getAllTasks từ controller

router.post("/", createTask ); // Sử dụng hàm createTask từ controller

router.put("/:id", updateTask); // Sử dụng hàm updateTask từ controller

router.delete("/:id", deleteTask); // Sử dụng hàm deleteTask từ controller);

export default router;
