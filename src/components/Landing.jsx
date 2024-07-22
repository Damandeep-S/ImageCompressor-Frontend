import React, { useState } from "react";
import "./Landing.css";

const Landing = () => {
  const [file, setFile] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState("");

  const handleFileChange = (event) => {
    debugger
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    debugger
    if (!file) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("imgFile", file);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/image/compress-img",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setCompressedImageUrl(result.data.imgFile);
      alert("Image uploaded and compressed successfully.");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    }
  };

  const handleDownload = async () => {
    if (!compressedImageUrl) {
      alert('No compressed image available to download.');
      return;
    }

    try {
      const response = await fetch(compressedImageUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'compressed_image.jpg';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('An error occurred while downloading the image.');
    }
  };


  return (
    <div>
      <h1>Image Compressor</h1>
      <form className="upload-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="fileInput" className="upload-button">
          Upload Image
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <button type="button" className="upload-button2" onClick={handleUpload}>
          Upload and Compress
        </button>
        <button
          type="button"
          className="download-button"
          onClick={handleDownload}
        >
          Download Compressed Image
        </button>
      </form>
    </div>
  );
};

export default Landing;
