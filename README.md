# DALL-E Image Generator

A full-stack web application that generates, stores, and displays AI-generated images using OpenAI's DALL-E model.

## 🎯 Goal

Create a platform where users can:

1. Enter text prompts to generate images using AI
2. View a gallery of previously generated images
3. Store image metadata and URLs in a database

## 🏗️ Architecture

### Frontend

- **React 19** + **Vite** for fast development
- **TanStack React Query** for server state management
- **Axios** for API calls
- Runs on `http://localhost:5174`

### Backend

- **Express.js** Node server
- RESTful API with two main routes:
  - `POST /generate-image` - Generate a new image from prompt
  - `GET /images` - Fetch all saved images
- Runs on `http://localhost:9000`

### Database

- **MongoDB Atlas** - Stores image records (prompt, URL, public ID, timestamps)

## 🔧 Key Integrations

### OpenAI (DALL-E)

- Generates images from text prompts
- Model: `gpt-image-1`
- Returns either URL or base64-encoded image data
- Handles errors gracefully

### Cloudinary

- Cloud storage for generated images
- Uploads images to `ai-art-work` folder
- Provides secure, CDN-enabled URLs
- Automatic image optimization

### MongoDB

- Stores gallery metadata:
  ```
  {
    prompt: String,
    url: String (Cloudinary secure URL),
    public_id: String (Cloudinary ID),
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
  ```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- OpenAI API key
- Cloudinary account
- MongoDB Atlas connection string

### Setup

1. **Clone and install:**

   ```bash
   git clone <repo-url>
   cd dalle-image-generator

   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend/vite-project
   npm install
   ```

2. **Environment variables** - Create `backend/.env`:

   ```
   OPENAI_KEY=sk-...
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/...
   ```

3. **Run servers:**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend/vite-project
   npm run dev
   ```

4. **Open browser:**
   - Frontend: `http://localhost:5174`
   - API: `http://localhost:9000`

## 📝 API Routes

### Generate Image

```
POST /generate-image
Body: { "prompt": "a sunset over mountains" }
Response: {
  "_id": "...",
  "prompt": "...",
  "url": "https://cloudinary.com/...",
  "public_id": "ai-art-work/...",
  "createdAt": "2026-06-20..."
}
```

### Get All Images

```
GET /images
Response: [
  { _id, prompt, url, public_id, createdAt, updatedAt },
  ...
]
```

## 🛠️ Tech Stack Summary

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React, Vite, TanStack Query, Axios      |
| Backend  | Express.js, Node.js, CORS               |
| AI       | OpenAI DALL-E 3                         |
| Storage  | Cloudinary (images), MongoDB (metadata) |
| DevOps   | Git, GitHub                             |

## ⚠️ Notes

- CORS is configured to allow `localhost:5173` and `localhost:5174`
- Images are stored in Cloudinary's `ai-art-work` folder
- MongoDB stores only metadata; images are served from Cloudinary CDN
- Environment variables must be set before running the backend

---

Built with ❤️ using OpenAI, Cloudinary, and MongoDB
