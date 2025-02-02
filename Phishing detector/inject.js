function scanEmailsForLinks() {
    const emailLinks = document.querySelectorAll("a");

    emailLinks.forEach(link => {
        const url = link.href;

        // Send the URL to background for checking
        chrome.runtime.sendMessage({ action: "checkUrl", url }, (response) => {
            if (response && response.isPhishing) {
                link.style.border = "2px solid red"; // Highlight phishing links
                link.setAttribute("title", "⚠️ This link may be unsafe!");
                link.style.color = "red";
                link.style.fontWeight = "bold";
            } else {
                link.style.border = "2px solid green"; // Safe links
                link.setAttribute("title", "✅ This link is safe.");
                link.style.color = "green";
                link.style.fontWeight = "bold";
            }
        });
    });
}

// Observe changes inside Gmail (detects when new emails load)
const observer = new MutationObserver(scanEmailsForLinks);
observer.observe(document.body, { childList: true, subtree: true });

// Run once on load
scanEmailsForLinks();
