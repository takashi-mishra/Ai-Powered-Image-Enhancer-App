import React, { useState } from "react";
import "./Imagepreview.css";
import axios from "axios";

const GenrateImage = () => {
  const [image, setImage] = useState("/Stock10.jpg");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userPrompt = prompt; // Save before clearing
    setPrompt(""); // ✅ Clear the input box
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("prompt", userPrompt);

      const response = await axios.post(
        "https://clipdrop-api.co/text-to-image/v1",
        formData,
        {
          headers: {
            "x-api-key":
              "d8bb34286c2e205b6d75b9ea884b276e2548785d0a696a5390a2e21b23f8d64e922e01ef5107b40f5602e65ff3004c2f",
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 id="text">AI Powered Image Generator</h1>

      <div id="image-container">
        <div id="image-preview">
          <img src={image} alt="Generated" className="image-Encha" />
          {loading && (
            <p style={{ color: "white", marginTop: "10px" }}>Generating...</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div id="input-field-and-btn">
            <input
              type="text"
              id="inp"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type the Description about your image"
            />
            <button id="btn-gen" disabled={loading}>
              {loading ? "Loading..." : "Generate"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GenrateImage;
