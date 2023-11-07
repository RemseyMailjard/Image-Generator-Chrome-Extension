document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    console.log(selectedText); // This will show an alert with the selected text
  }
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.text) {
    console.log(request.text); // Now you can alert the selected text
  }
});
chrome.runtime.sendMessage(
  { action: "generateImage", prompt: "your prompt here" },
  (response) => {
    if (response.success) {
      // Handle the successful response
    } else {
      // Handle the error
    }
  }
);
