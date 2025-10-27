//import { act } from 'react';
import Task from '../models/Task.js';

export const getAllTasks = async (req, res) => { //async hàm bất đồng bộ
    const {filter = 'today'} = req.query;
    const now = new Date();
    let starDate;

    switch(filter){
        case 'today':
            starDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //2025/10/24 00:00
            break;
        case 'week':
            const mondayDate = now.getDate() - (now.getDate() -1) - (now.getDate() === 0 ? 7 : 0); //lấy ngày thứ 2 của tuần hiện tại
            starDate = new Date(now.getFullYear(), now.getMonth(), mondayDate); 
            break;
        case 'month' :
            starDate =  new Date(now.getFullYear(), now.getMonth(), 1); //ngày đầu tiên của tháng
            break;
        case 'all' : 
        default: {
            starDate = null;
        }
    }

    const query = starDate ? {createdAt: {$gte: starDate}} : {};

    try {
        const result = await Task.aggregate([
            { $match: query },
            {
                $facet: {
                    tasks: [{$sort: {createdAt: -1}}],
                    activeCount: [{$match: {status: "active"}}, {$count: "count"}],
                    completedCount: [{$match: {status: "completed"}}, {$count: "count"}]
                }
            }
        ])

        const tasks = result[0].tasks;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completedCount = result[0].completedCount[0]?.count || 0;

        res.status(200).json({ tasks, activeCount, completedCount });
    } catch (error) {
        console.error("Lỗi khi gọi getAllTasks", error);
        res.status(500).json({message: "Lỗi hệ thống!"});
    }   
};

export const createTask  = async (req, res) => {
    try {
        const {title} = req.body;
        const task = new Task({title});

        const newTask = await task.save();
        res.status(201).json(newTask);

    } catch (error) {
        console.error("Lỗi khi gọi createTask", error);
        res.status(500).json({message: "Lỗi hệ thống!"});
    }
};

export const updateTask = async (req, res) => {
    try {
        const {title, status, completedAt} = req.body;
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt
            },
            {new: true} //trả về tài liệu đã cập nhật thay vì tài liệu gốc
        );

        if(!updateTask){
            return res.status(404).json({message: "Không tìm thấy nhiệm vụ!"});
        }
        
        res.status(200).json(updateTask);
        
    } catch (error) {
        console.error("Lỗi khi gọi updateTask", error);
        res.status(500).json({message: "Lỗi hệ thống!"});
    }
};

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id);

        if(!deleteTask){
            return res.status(404).json({message: "Không tìm thấy nhiệm vụ!"});
        }

        res.status(200).json(deleteTask);

    } catch (error) {
        console.error("Lỗi khi gọi deleteTask", error);
        res.status(500).json({message: "Lỗi hệ thống!"});
    }
};