import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import "./GenerateImage.css";
import Images from "./Images";

//! Function to call the backend api
const generateImageAPI = async (prompt) => {
  const res = await axios.post("http://localhost:9000/generate-image", {
    prompt,
  });
  return res.data;
};

function GenerateImage() {
  const [prompt, setPrompt] = useState("");
  //! mutation
  const mutation = useMutation({
    mutationFn: generateImageAPI,
    mutationKey: ["dalle"],
  });
  //! Submit handler
  const handleGenerateImage = () => {
    if (!prompt) {
      alert("Prompt is required");
      return;
    }
    mutation.mutate(prompt);
  };
  return (
    <>
      <div className="header">
        <h1 className="title">AI Image Generator using Dalle 3 from OpenAI</h1>
        <p className="description">
          Enter a prompt in the input field below to generate a unique image
          using AI.
        </p>
        <p>{mutation.isError && mutation.error.message}</p>
      </div>
      <div className="container">
        <input
          className="input-prompt"
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          className="generate-btn"
          type="submit"
          onClick={handleGenerateImage}
        >
          {mutation?.isPending ? "Generating..." : "Generate Image"}
        </button>
      </div>
    </>
  );
}

export default GenerateImage;
