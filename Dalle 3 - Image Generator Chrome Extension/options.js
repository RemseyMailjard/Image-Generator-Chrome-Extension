// When the DOM is ready...
document.addEventListener("DOMContentLoaded", function () {
  // Load any existing API key from storage.
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey) {
      // If an API key exists, hide the 'enter' link and show the 'change' link with icon.
      document.getElementById('enterApiKey').style.display = 'none';
      document.getElementById('changeApiKey').style.display = 'inline';
    } else {
      // If no API key, show the 'enter' link.
      document.getElementById('enterApiKey').style.display = 'inline';
      document.getElementById('changeApiKey').style.display = 'none';
    }
  });

  // When the form is submitted...
  document
    .getElementById("api-key-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting via the browser.

      const apiKey = document.getElementById("apiKey").value;
      // Save the API key into local storage.
      chrome.storage.local.set({ apiKey: apiKey }, function () {
        console.log("API Key saved");
        // Notify the user that the API key was saved.
        alert("API Key saved successfully!");
        // Update the display of the links.
        document.getElementById('enterApiKey').style.display = 'none';
        document.getElementById('changeApiKey').style.display = 'inline';
      });
    });
});
