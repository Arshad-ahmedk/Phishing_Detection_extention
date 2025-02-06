const API_KEY = "#######"; // Replace with your actual API key

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ extensionEnabled: true });
    console.log("Phishing Link Detector Installed. Extension is ON by default.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleExtension") {
        chrome.storage.sync.set({ extensionEnabled: message.enabled });
        console.log("Extension Enabled:", message.enabled);
    }

    if (message.action === "checkUrl") {
        checkPhishing(message.url).then(isPhishing => {
            console.log(`Checked URL: ${message.url}, Result: ${isPhishing ? "PHISHING" : "SAFE"}`);
            sendResponse({ isPhishing });
        });
        return true;  // Required for async response
    }
});

async function checkPhishing(url) {
    const requestBody = {
        client: {
            clientId: "phishing-detector",
            clientVersion: "1.1"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    try {
        console.log("Sending request to Google Safe Browsing API...");
        const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        console.log("API Response:", data);

        return data.matches ? true : false;  // If matches found, it's phishing
    } catch (error) {
        console.error("Safe Browsing API error:", error);
        return false;
    }
}
