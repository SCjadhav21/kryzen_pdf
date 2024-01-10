const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const multer = require("multer");
const path = require("path");

const { PDFDocument, StandardFonts, degrees, rgb } = require("pdf-lib");
const { Authentication } = require("../middelware/authentication");

const { UserModel } = require("../models/user.model");

const UserRoutes = express.Router();

UserRoutes.post("/register", async (req, res) => {
  let { password, username } = req.body;

  try {
    const users = await UserModel.find({ username });
    if (users.length > 0) {
      res.status(200).send("user is already exist try with new username");
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(500).send(err);
        } else {
          const user = new UserModel({
            username,

            password: hash,
          });
          await user.save();
          res.status(201).send("user Registered successfully");
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

UserRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else if (result) {
          const token = jwt.sign({ userId: user._id }, process.env.key);
          res.status(200).send({
            msg: "Login Successfull",
            name: user.username,
            token: token,
          });
        } else {
          res.status(200).send("Wrong Credntials");
        }
      });
    } else {
      res.status(200).send("Wrong Credntials");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

UserRoutes.get("/", Authentication, async (req, res) => {
  try {
    const userData = await UserModel.find({ _id: req.body.userId });
    res.status(200).send(userData);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

UserRoutes.post(
  "/uploaddata",
  upload.single("file"),
  Authentication,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }
      let userId = req.body.userId;
      const filePath = req.file.path;

      const { name, age, address } = req.body;
      if (!name && !age && !address) {
        return res.status(400).json({
          message: "Name or age or address must be provided for update",
        });
      }
      const updateFields = {};
      updateFields.name = name;
      updateFields.age = age;
      updateFields.address = address;
      updateFields.photo = filePath;

      const result = await UserModel.updateOne(
        { _id: userId },
        { $set: updateFields }
      );

      if (result.matchedCount > 0) {
        res.status(200).json({ message: "User updated successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

UserRoutes.post("/downloadpdf", Authentication, async (req, res) => {
  try {
    const userData = await UserModel.findOne({ _id: req.body.userId });

    res.status(200).json({ userData });
  } catch (error) {
    console.error("Error downloading PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { UserRoutes };
