import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import AppError from "../lib/utils/AppError.js";

const register = async (req, res) => {
  const { name, email, password, role, isActive, phone, address, photo } =
    req.body;

  console.log(req.body, "req.body, from register");

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashPassword,
      phone: phone || null,
      address: address || null,
      photo: photo || null,
      isActive,
    },
  });

  res.status(201).json({
    success: true,
    message: "Registration successful!",
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass) {
    throw new AppError("Invalid credentials!", 400);
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
};

const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logout successfull" });
};

const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  res.status(200).json({ success: true, message: "User found", user });
};

export { register, login, logout, getMe };
