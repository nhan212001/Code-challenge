import type { Request, Response } from "express";
import { db } from "../firebase.js";

const collection = db.collection("users");

// CREATE user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const newUser = await collection.add({
      name,
      email,
      age,
      createdAt: new Date(),
    });
    res.json({ id: newUser.id, name, email, age });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// LIST users
export const listUsers = async (_req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET user details
export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// UPDATE user
export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const { name, email, age } = req.body;
    await collection.doc(req.params.id).update({ name, email, age });
    res.json({
      message: "User updated successfully",
      user: { name, email, age },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    await collection.doc(req.params.id).delete();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
