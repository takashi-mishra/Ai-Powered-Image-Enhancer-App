import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Imagepreview.css";

const API_KEY = "wxw3bst5ic5turfa8"; // Replace with your real key
const BASE_URL = "https://techhk.aoscdn.com";
const MAXIMUM_RETRIES = 20;

const Imagepreview = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [imageURL, setImageURL] = useState("/Before.png");
  const [enhancedImage, setEnhancedImage] = useState("/after.png");
  const [loading, setLoading] = useState(false); // <-- new state

  // Uploads image and initiates enhancement
  const enhancedImageAPI = async (file) => {
    try {
      const taskId = await uploadImage(file);
      console.log("Image Uploaded Successfully, Task ID:", taskId);

      const enhancedImageData = await pollForEnhancedImage(taskId);
      console.log("Enhanced Image Data:", enhancedImageData);

      return enhancedImageData;
    } catch (error) {
      console.error("Error enhancing image:", error.message);
    }
  };

  // Upload image to get task ID
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image_file", file);

    const { data } = await axios.post(
      `${BASE_URL}/api/tasks/visual/scale`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
        },
      }
    );

    if (!data?.data?.task_id) {
      throw new Error("Failed to upload image! Task ID not found.");
    }

    return data.data.task_id;
  };

  // Poll for enhanced image
  const pollForEnhancedImage = async (taskId, retries = 0) => {
    const result = await fetchEnhancedImage(taskId);

    console.log("Result state:", result.state);

    if (result.state === 4) {
      if (retries >= MAXIMUM_RETRIES) {
        throw new Error("Max retries reached. Please try again later.");
      }

      console.log(`Retrying... (${retries + 1}/${MAXIMUM_RETRIES})`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return pollForEnhancedImage(taskId, retries + 1);
    }

    console.log("Enhanced Image URL:", result.image);
    return result.image;
  };

  // Get image enhancement result
  const fetchEnhancedImage = async (taskId) => {
    const { data } = await axios.get(
      `${BASE_URL}/api/tasks/visual/scale/${taskId}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );

    if (!data?.data) {
      throw new Error("Failed to fetch enhanced image! Image not found.");
    }

    return data.data;
  };

  // Submit handler
  const onSubmit = async (data) => {
    const file = data.img[0];
    const previewURL = URL.createObjectURL(file);
    setImageURL(previewURL);
    setLoading(true);

    try {
      const resultImage = await enhancedImageAPI(file);
      if (resultImage) {
        setEnhancedImage(resultImage);
      }
    } catch (error) {
      console.log("Final Error:", error.message);
    } finally {
      setLoading(false); // Spinner OFF
    }
  };

  return (
    <div id="contain">
      <div id="img-cont">
        <div id="image-1">
          <img src={imageURL} loading="lazy" alt="Uploaded Preview" />
        </div>

        <div id="image-2" className="image-1">
          <img src={enhancedImage} loading="lazy" alt="Enhanced Result" />
        </div>
      </div>
      <div id="input-field">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="img" id="img-lab">
              Upload Image
            </label>
            <input
              id="img"
              type="file"
              accept="image/*"
              {...register("img", { required: "Please upload an image" })}
            />
            {errors.img && <p>{errors.img.message}</p>}
            <button type="submit">Preview</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Imagepreview;
