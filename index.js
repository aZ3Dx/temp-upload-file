import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
  region: "auto",
  endpoint: "https://15df053443662399988dd417aab2d03b.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const bucketPublicUrl = "https://pub-f0c1c4f3fec14973acc77428b3064f21.r2.dev";

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileName = uuidv4();
  const params = {
    Bucket: "temp-files",
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));
  res.json({ url: `${bucketPublicUrl}/${params.Key}` });
});

app.listen(3000, () => console.log("Server running on port 3000"));
