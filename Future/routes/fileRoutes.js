const express = require("express");
const multer = require("multer");
const path = require("path");

const { v4: uuidv4 } = require("uuid");
const File = require("../models/File");

const MAX_SIZE = 50 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage, limits: { fileSize: MAX_SIZE } }).single(
  "file"
);

const router = express.Router();

router.post("/upload", (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send("File size exceed...");
      }
      return res.status(500).send(err.message);
    }
    if (!req.file) return res.status(400).send("No file uploaded!");

    const fileData = new File({
      original_name: req.file.originalname,
      file_name: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uuid: uuidv4(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // from present to 24 hr..
    });

    await fileData.save();

    res.json({
      fileUrl: `${req.protocol}://${req.get("host")}/api/v1/download/${
        fileData.uuid
      }`,
    });
  });
});

router.get("/download/:uuid", async (req, res) => {
  try {
    const id = req.params.uuid;
    const file = await File.findOne({
      uuid: id,
    });
    if (!file) {
      return res.status(404).send("File not found");
    }
    res.download(file.path, file.original_name);
  } catch (error) {
    console.log("download get request error..", error);
    res.status(500).send("server error");
  }
});

module.exports = router;

// user can upload and get download link..
// file size limitation added..
