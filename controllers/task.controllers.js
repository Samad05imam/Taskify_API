import { Task } from "../models/task.model.js";

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Missing : Title Or Description !",
                success: false
            });
        }

        const task = await Task.create({
            title,
            description,
            status: status || "pending",
            createdBy: req.user._id,
        });

        res.status(201).json({
            message:"Task added",
            success: true,
            task
        });
    } catch (err) {
        console.error("Task creation error:", err);
        res.status(500).json({
            message: "Error in creating the task!",
            success: false,
            error: err.message
        });
    }
};

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            tasks
        });
    } catch (err) {
        res.status(500).json({
            message: "No task found as its an error",
            success: false,
        });
    }
};

// Get a single task by its ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            task
        });
    } catch (err) {
        res.status(500).json({
            message: "Error in finding the task !",
            success: false,
        });
    }
};

// Update a task by its ID
export const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({
            _id: req.params.id,
            createdBy: req.user._id
        },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTask)
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });

        res.status(200).json({ success: true, task: updatedTask, message: "Task updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error in updating the task!" });
    }
};

// Delete a task by its ID
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found or unauthorized",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted"

        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
