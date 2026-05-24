import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive, phone, address, photo } =
      req.body;

    console.log(req.body, "req.body");

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
        phone,
        isActive,
        address,
        photo,
      },
    });

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.log(err, "err");

    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      email,
      role,
      isActive,
      sortBy,
      sortOrder,
    } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (email) {
      where.email = { contains: email, mode: "insensitive" };
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: sortBy
          ? { [sortBy]: sortOrder || "asc" }
          : { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          phone: true,
          address: true,
          photo: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      data: users,
      count: total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      isActive,
      phone,
      address,
      photo,
    } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (password && confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (address !== undefined) updateData.address = address;
    if (photo !== undefined) updateData.photo = photo;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (email && email !== user.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          NOT: { id: id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "This email is already being used by another staff!",
        });
      }
      updateData.email = email;
    }

    if (phone !== undefined && phone !== user.phone) {
      if (phone) {
        const existingPhone = await prisma.user.findFirst({
          where: {
            phone: phone,
            NOT: { id: id },
          },
        });
        if (existingPhone) {
          return res.status(400).json({
            success: false,
            message:
              "This phone number is already being used by another staff!",
          });
        }
      }
      updateData.phone = phone;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { getUsers, updateUser, resetPassword, createUser };
