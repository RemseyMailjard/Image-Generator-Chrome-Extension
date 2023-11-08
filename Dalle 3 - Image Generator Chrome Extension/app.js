document.addEventListener("DOMContentLoaded", init);

function init() {
  document
    .getElementById("btnGenerate")
    .addEventListener("click", generateImage);
}

const myImage = document.getElementById("imageResult");

// Function to get the value of the prompt from the input field
function getPromptValue() {
  const promptInput = document.getElementById("myPrompt");
  return promptInput.value.trim();
}

// Function to generate image based on the prompt
async function generateImage() {
  // Get the current prompt value
  const currentPrompt = getPromptValue();

  // Check if the prompt is empty and exit if so
  if (!currentPrompt) {
    alert("Please enter a prompt.");
    return;
  }

  // Get additional options
  const selectedSize = document.getElementById("imageSize").value;
  const isHighQuality = document.getElementById("highQuality").checked;
  const styleVivid = document.getElementById("styleVivid").checked;
  const style = styleVivid ? "vivid" : "natural";

  // Retrieve the API key from storage
  chrome.storage.local.get("apiKey", async function (data) {
    const openaiApiKey = data.apiKey;

    // If no API key is found, alert the user
    if (!openaiApiKey) {
      alert("Please set your OpenAI API key in the extension options.");
      return;
    }

    const requestBody = {
      model: "dall-e-3",
      prompt: currentPrompt,
      quality: isHighQuality ? "hd" : "standard",
      n: 1,
      size: selectedSize,
      style: style,
    };

    try {
      // Display the loading message before starting the fetch operation
      myImage.innerHTML = "It is busy loading...";

      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      displayImage(result);
    } catch (error) {
      console.error("Error:", error.message);
      myImage.innerHTML = "An error occurred while generating the image.";
    }
  });
}
// Function to display the image result and provide a download link
function displayImage(imageResult) {
  const imageContainer = document.getElementById("imageResult");

  if (imageResult.data && imageResult.data.length > 0) {
    const imageUrl = imageResult.data[0].url;

    // Store the image URL in localStorage
    localStorage.setItem('storedImage', imageUrl);

    // Update the innerHTML of the imageResult with the image, download link, and clear button
    imageContainer.innerHTML = `
      <img id="generatedImage" src="${imageUrl}" alt="Generated Image" style="max-width: 100%;">
      <a id="downloadLink" href="${imageUrl}" download="generated_image.png" class="btn btn-success btn-sm mt-2">Download Image</a>
      <button id="clearImageButton" class="btn btn-danger btn-sm mt-2">Clear Image</button>
    `;

    // Display the image, the download link, and the clear button
    document.getElementById("generatedImage").style.display = "block";
    document.getElementById("downloadLink").style.display = "block";
    document.getElementById("clearImageButton").style.display = "block";

    // Bind the click event to the clear button
    document.getElementById("clearImageButton").onclick = clearImage;
  } else {
    imageContainer.innerHTML = "No image found.";
  }
}
function clearImage() {
  // Clear the image from localStorage
  localStorage.removeItem('storedImage');

  // Clear the image from the display
  const imageContainer = document.getElementById("imageResult");
  imageContainer.innerHTML = "";
}


// Call this function when the sidebar is opened or refreshed
function retrieveStoredImage() {
  const storedImageUrl = localStorage.getItem("storedImage");
  if (storedImageUrl) {
    displayImage({ data: [{ url: storedImageUrl }] });
  }
}

// Add this line at the beginning of your sidebar script to check for stored images when the extension is opened
retrieveStoredImage();

// Example trigger, you may want to bind this to a button click or form submission
// generateImage();

// If you need to call generateImage when the page loads, uncomment the line below
// window.onload = generateImage;
