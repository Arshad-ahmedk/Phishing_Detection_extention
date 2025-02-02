let detectionEnabled = false;
let originalColor = new Map(); // Store original link colors

function checkLink(event) {
    if (!detectionEnabled) return;

    const target = event.target.closest("a");
    if (target) {
        const url = target.href;

        // Store original color if not already stored
        if (!originalColor.has(target)) {
            originalColor.set(target, target.style.color);
        }

        // Send the URL to background.js for checking
        chrome.runtime.sendMessage({ action: "checkUrl", url }, (response) => {
            if (response && response.isPhishing) {
                target.setAttribute("title", "⚠️ This link may be unsafe!");
                target.style.color = "red"; // Temporarily change color
            } else {
                target.setAttribute("title", "✅ This link is safe.");
                target.style.color = "green"; // Temporarily change color
            }
        });
    }
}

// Restore original color on mouseout
function restoreColor(event) {
    const target = event.target.closest("a");
    if (target && originalColor.has(target)) {
        target.style.color = originalColor.get(target);
    }
}

// Function to handle click event and show confirmation
function handleClick(event) {
    if (!detectionEnabled) return;

    const target = event.target.closest("a");
    if (target) {
        const url = target.href;

        // Stop default navigation immediately
        event.preventDefault();

        // Send the URL to background.js for checking
        chrome.runtime.sendMessage({ action: "checkUrl", url }, (response) => {
            if (response && response.isPhishing) {
                // Show confirmation alert
                const userConfirmed = confirm("⚠️ WARNING: This link may be unsafe!\nDo you want to continue?");
                if (userConfirmed) {
                    window.location.href = url; // Allow navigation
                }
            } else {
                // Safe link → Proceed with navigation
                window.location.href = url;
            }
        });
    }
}

function startDetection() {
    if (!detectionEnabled) {
        document.addEventListener("mouseover", checkLink);
        document.addEventListener("mouseout", restoreColor);
        document.addEventListener("click", handleClick, true); // Use capturing phase for click events
        detectionEnabled = true;
        console.log("Phishing detection ENABLED");
    }
}

function stopDetection() {
    if (detectionEnabled) {
        document.removeEventListener("mouseover", checkLink);
        document.removeEventListener("mouseout", restoreColor);
        document.removeEventListener("click", handleClick, true);
        detectionEnabled = false;
        console.log("Phishing detection DISABLED");

        // Remove titles and restore original colors
        document.querySelectorAll("a").forEach(link => {
            link.removeAttribute("title"); // Remove tooltip text
            if (originalColor.has(link)) {
                link.style.color = originalColor.get(link); // Restore original color
            }
        });

        originalColor.clear(); // Clear stored colors
    }
}


// Initial state check
chrome.storage.sync.get("extensionEnabled", function (data) {
    if (data.extensionEnabled !== false) {
        startDetection();
    }
});

// Listen for toggle message from popup
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggleExtension") {
        if (message.enabled) {
            startDetection();
        } else {
            stopDetection();
        }
    }
});
