chrome.runtime.onInstalled.addListener(() => {
  // Set up context menu items
  chrome.contextMenus.create({
    id: "searchGoogle",
    title: 'Search on Google: "%s"',
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "searchYoutube",
    title: 'Search on YouTube: "%s"',
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "searchGoogle") {
    const query = encodeURIComponent(info.selectionText);
    const googleSearchUrl = `https://www.google.com/search?q=${query}`;
    chrome.tabs.create({ url: googleSearchUrl });
  } else if (info.menuItemId === "searchYoutube") {
    const query = encodeURIComponent(info.selectionText);
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${query}`;
    chrome.tabs.create({ url: youtubeSearchUrl });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateImage") {
    // Retrieve the API key from local storage
    chrome.storage.local.get('apiKey', function(data) {
      const apiKey = data.apiKey;
      // Check if API key is set
      if (!apiKey) {
        console.error('No API key set in options');
        sendResponse({ success: false, error: 'No API key set in options' });
        return;
      }
      
      fetch('<your-server-endpoint>', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          // The server will use the apiKey to authenticate with OpenAI
        }),
        body: JSON.stringify({
          prompt: request.prompt,
          apiKey: apiKey // Pass the API key to your server
        }),
      })
      .then(response => response.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error }));
    });
    return true; // Indicate that sendResponse will be called asynchronously
  }
});
