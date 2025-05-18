<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Temporary Image Uploader | abella.biz.id</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
</head>
<body>
  <div class="container">
    <header>
      <h1>Image Uploader</h1>
      <p>Upload your images temporarily for 30 minutes</p>
    </header>

    <main>
      <div class="upload-box" id="uploadBox">
        <input type="file" id="imageInput" accept="image/*" hidden>
        <div class="drop-area" id="dropArea">
          <img src="https://cdn-icons-png.flaticon.com/512/1160/1160358.png" alt="Upload" class="upload-icon">
          <h3>Drag & Drop your image here</h3>
          <p>or</p>
          <button class="btn" id="selectBtn">Select Image</button>
        </div>
      </div>

      <div class="preview-container" id="previewContainer" style="display: none;">
        <h3>Image Preview</h3>
        <div class="image-preview" id="imagePreview"></div>
        <button class="btn upload-btn" id="uploadBtn">Upload Image</button>
      </div>

      <div class="result-container" id="resultContainer" style="display: none;">
        <h3>Your image is ready!</h3>
        <div class="uploaded-image" id="uploadedImage"></div>
        <div class="link-container">
          <input type="text" id="imageLink" readonly>
          <button class="btn copy-btn" id="copyBtn">Copy Link</button>
        </div>
        <p class="expiry-info">This image will expire in 30 minutes</p>
      </div>
    </main>

    <footer>
      <p>© 2023 abella.biz.id - Temporary Image Hosting</p>
    </footer>
  </div>

  <script src="/script.js"></script>
</body>
</html>
