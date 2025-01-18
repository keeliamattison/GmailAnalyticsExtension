// contentScript.js
console.log('Email Analytics Extension: Content script loaded');

function extractEmailData() {
    console.log('Starting email extraction...');
    
    // Gmail's structure has changed - let's try multiple selector approaches
    const emailContainers = document.querySelectorAll('tr[role="row"]');
    console.log(`Found ${emailContainers.length} potential email containers`);
    
    const emailData = [];
    
    emailContainers.forEach(container => {
        // Try to find sender information
        const senderElement = container.querySelector('[email], [data-email], span[title*="@"]');
        
        if (senderElement) {
            let emailAddress = '';
            
            // Try different ways to get the email
            if (senderElement.getAttribute('email')) {
                emailAddress = senderElement.getAttribute('email');
            } else if (senderElement.getAttribute('data-email')) {
                emailAddress = senderElement.getAttribute('data-email');
            } else if (senderElement.title && senderElement.title.includes('@')) {
                // Extract email from title attribute
                emailAddress = senderElement.title.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || '';
            }
            
            if (emailAddress && emailAddress.includes('@')) {
                const domain = emailAddress.split('@')[1];
                emailData.push({ email: emailAddress, domain });
            }
        }
    });

    console.log(`Extracted ${emailData.length} email addresses`);
    
    if (emailData.length > 0) {
        const stats = {
            domainStats: {},
            totalEmails: emailData.length
        };

        emailData.forEach(({ domain }) => {
            stats.domainStats[domain] = (stats.domainStats[domain] || 0) + 1;
        });

        console.log('Saving stats:', stats);
        chrome.storage.local.set({ emailStats: stats }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error saving stats:', chrome.runtime.lastError);
            } else {
                console.log('Successfully saved email stats');
            }
        });
    }
}

// Initial delay to let Gmail load
setTimeout(() => {
    console.log('Running initial extraction...');
    extractEmailData();
}, 3000);

// Set up observer for dynamic updates
const observer = new MutationObserver((mutations) => {
    console.log('Page updated, re-running extraction...');
    extractEmailData();
});

// Start observing once the main content area is loaded
function startObserving() {
    const mainContent = document.querySelector('div[role="main"]');
    if (mainContent) {
        observer.observe(mainContent, {
            childList: true,
            subtree: true
        });
        console.log('Observer started');
    } else {
        setTimeout(startObserving, 1000);
    }
}

startObserving();