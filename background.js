/**
 * background.js
 * Background service worker for processing email data
 */
// Cache for storing processed email data
let emailCache = {};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EMAIL_DATA') {
    processEmailData(message.data);
  }
});

/**
 * Process raw email data and update statistics
 * @param {Array} emailData - Array of email objects to process
 */
function processEmailData(emailData) {
  const stats = {
    domainStats: {},
    timeStats: {},
    totalEmails: 0
  };

// Process each email and update statistics
  emailData.forEach(email => {
    // Process domain statistics
    if (!stats.domainStats[email.domain]) {
      stats.domainStats[email.domain] = 0;
    }
    stats.domainStats[email.domain]++;

    // Process time statistics
    const hour = new Date(parseInt(email.timestamp)).getHours();
    const timeKey = `${hour}:00`;
    if (!stats.timeStats[timeKey]) {
      stats.timeStats[timeKey] = 0;
    }
    stats.timeStats[timeKey]++;

    stats.totalEmails++;
  });
  
// Save updated statistics to chrome storage
  chrome.storage.local.set({ emailStats: stats });
}