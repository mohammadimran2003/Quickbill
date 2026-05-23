import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

const register = async (req, res) => {
  try {
    const { name, email, password, role, isActive, phone, address, photo } =
      req.body;

    //check existing user;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found!" });
    }

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      res.status(400).json({ message: "Invalid credintials!" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const logout = (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ success: true, message: "Logout successfull" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(200).json({ success: true, message: "User found", user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { register, login, logout, getMe };
