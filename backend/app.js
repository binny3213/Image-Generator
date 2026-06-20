import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config, uploader } from "cloudinary";
import OpenAI from "openai";
const app = express();
const PORT = 9000;

//! Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((e) => console.log(e.message));

//! Gallery model
const gallerySchema = new mongoose.Schema(
  {
    prompt: String,
    url: String,
    public_id: String,
  },
  {
    timestamps: true,
  },
);
const Gallery = mongoose.model("Gallery", gallerySchema);

//! Configure openai
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
//! Configure cloudinary
config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
//! Cors
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
//! Middlewares
app.use(express.json());
app.use(cors(corsOptions));

//! Route
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageData = imageResponse?.data?.[0];
    if (!imageData) {
      throw new Error("No image data returned from OpenAI");
    }

    let uploadSource;
    if (imageData.url) {
      uploadSource = imageData.url;
    } else if (imageData.b64_json) {
      uploadSource = `data:image/png;base64,${imageData.b64_json}`;
    } else {
      throw new Error("Unsupported OpenAI image payload");
    }

    const image = await uploader.upload(uploadSource, {
      folder: "ai-art-work",
    });

    const imageCreated = new Gallery({
      prompt,
      url: image.secure_url,
      public_id: image.public_id,
    });

    await imageCreated.save();
    res.json(imageCreated);
  } catch (error) {
    console.error("Image generation failed:", error);
    res
      .status(500)
      .json({ message: "Error generating image", error: error.message });
  }
});

//!List images route
app.get("/images", async (req, res) => {
  try {
    const images = await Gallery.find();
    res.json(images);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error fetching images" });
  }
});

//! Start the server
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));
