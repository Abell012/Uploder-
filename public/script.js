document.addEventListener('DOMContentLoaded', function() {
  const imageInput = document.getElementById('imageInput');
  const selectBtn = document.getElementById('selectBtn');
  const dropArea = document.getElementById('dropArea');
  const uploadBox = document.getElementById('uploadBox');
  const previewContainer = document.getElementById('previewContainer');
  const imagePreview = document.getElementById('imagePreview');
  const uploadBtn = document.getElementById('uploadBtn');
  const resultContainer = document.getElementById('resultContainer');
  const uploadedImage = document.getElementById('uploadedImage');
  const imageLink = document.getElementById('imageLink');
  const copyBtn = document.getElementById('copyBtn');
  
  let selectedFile = null;
  
  // Event listeners
  selectBtn.addEventListener('click', () => imageInput.click());
  
  imageInput.addEventListener('change', handleFileSelect);
  
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('highlight');
  });
  
  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('highlight');
  });
  
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('highlight');
    
    if (e.dataTransfer.files.length) {
      imageInput.files = e.dataTransfer.files;
      handleFileSelect({ target: imageInput });
    }
  });
  
  uploadBtn.addEventListener('click', uploadImage);
  
  copyBtn.addEventListener('click', copyLink);
  
  function handleFileSelect(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert('Please select an image file.');
      return;
    }
    
    selectedFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      uploadBox.style.display = 'none';
      previewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
  
  function uploadImage() {
    if (!selectedFile) return;
    
    uploadBtn.textContent = 'Uploading...';
    uploadBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        previewContainer.style.display = 'none';
        uploadedImage.innerHTML = `<img src="${data.imageUrl}" alt="Uploaded">`;
        imageLink.value = data.imageUrl;
        resultContainer.style.display = 'block';
        
        // Reset for new upload
        setTimeout(() => {
          selectedFile = null;
          imageInput.value = '';
        }, 1000);
      } else {
        alert(data.message || 'Error uploading image');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while uploading the image');
    })
    .finally(() => {
      uploadBtn.textContent = 'Upload Image';
      uploadBtn.disabled = false;
    });
  }
  
  function copyLink() {
    imageLink.select();
    document.execCommand('copy');
    
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }
});
