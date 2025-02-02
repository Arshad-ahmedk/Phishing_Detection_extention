document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");
    const checkButton = document.getElementById("checkButton");
    const urlInput = document.getElementById("urlInput");
    const resultText = document.getElementById("result");

    // Load current extension state
    chrome.storage.sync.get("extensionEnabled", function (data) {
        if (data.extensionEnabled === false) {
            toggleButton.classList.add("off");
            toggleButton.textContent = "Turn On";
        } else {
            toggleButton.classList.remove("off");
            toggleButton.textContent = "Turn Off";
        }
    });

    // Toggle phishing detection
    toggleButton.addEventListener("click", function () {
        chrome.storage.sync.get("extensionEnabled", function (data) {
            const newStatus = !data.extensionEnabled;
            chrome.storage.sync.set({ extensionEnabled: newStatus }, function () {
                // Update UI immediately
                if (newStatus) {
                    toggleButton.classList.remove("off");
                    toggleButton.textContent = "Turn Off";
                } else {
                    toggleButton.classList.add("off");
                    toggleButton.textContent = "Turn On";
                }

                // Send message to all tabs to update immediately
                chrome.tabs.query({}, function (tabs) {
                    for (let tab of tabs) {
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: toggleDetection,
                            args: [newStatus]
                        });
                    }
                });
            });
        });
    });

    // Manual URL Check
    checkButton.addEventListener("click", function () {
        const url = urlInput.value.trim();
        if (!url) {
            resultText.textContent = "❌ Enter a valid URL!";
            resultText.style.color = "red";
            return;
        }

        resultText.textContent = "Checking...";
        resultText.style.color = "black";

        // Send URL to background script for checking
        chrome.runtime.sendMessage({ action: "checkUrl", url }, function (response) {
            if (response && response.isPhishing) {
                resultText.textContent = "⚠️ This link is unsafe!";
                resultText.style.color = "red";
            } else {
                resultText.textContent = "✅ This link is safe.";
                resultText.style.color = "green";
            }
        });
    });

    // Function to toggle detection status on content script
    function toggleDetection(status) {
        if (status) {
            startDetection();
        } else {
            stopDetection();
        }
    }
});
