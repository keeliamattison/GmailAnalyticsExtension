document.addEventListener('DOMContentLoaded', function() {
    // Get reference to domain limit selector
    const domainLimitSelect = document.getElementById('domainLimit');

    // Function to update the domain list display
    function updateDomainList() {
        console.log('Updating domain list...'); // Debug log
        chrome.storage.local.get(['emailStats'], function(result) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            const stats = result.emailStats || { domainStats: {}, totalEmails: 0 };
            console.log('Retrieved stats:', stats); // Debug log
            
            // Update counters
            document.getElementById('emailCount').textContent = stats.totalEmails || 0;
            document.getElementById('domainCount').textContent = 
                Object.keys(stats.domainStats || {}).length;

            // Get and clear domain list container
            const domainListElement = document.getElementById('domainList');
            if (!domainListElement) {
                console.error('Domain list container not found!');
                return;
            }
            domainListElement.innerHTML = '';

            // Get domains and sort them
            const domainLimit = parseInt(domainLimitSelect.value);
            const domains = Object.entries(stats.domainStats || {})
                .sort(([, a], [, b]) => b - a)
                .slice(0, domainLimit);

            console.log('Domains to display:', domains); // Debug log

            if (domains.length > 0) {
                const maxCount = Math.max(...domains.map(([, count]) => count));

                domains.forEach(([domain, count]) => {
                    const percentage = (count / maxCount) * 100;
                    
                    const domainDiv = document.createElement('div');
                    domainDiv.className = 'domain-item';
                    domainDiv.innerHTML = `
                        <div>
                            <div>${domain}</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                        <div>${count} emails</div>
                    `;
                    domainListElement.appendChild(domainDiv);
                });
            } else {
                console.log('No domains to display'); // Debug log
                // Message for when no domains are available
                const noDataDiv = document.createElement('div');
                noDataDiv.textContent = 'No domain data available';
                domainListElement.appendChild(noDataDiv);
            }
        });
    }

    // Event listener for domain limit changes
    domainLimitSelect.addEventListener('change', function() {
        console.log('Selection changed to:', this.value); // Debug log
        chrome.storage.local.set({ domainLimit: this.value }, () => {
            updateDomainList();
        });
    });

    // Load saved preference and update display
    chrome.storage.local.get(['domainLimit'], function(result) {
        if (result.domainLimit) {
            domainLimitSelect.value = result.domainLimit;
        }
        updateDomainList();
    });

    // Initial display
    updateDomainList();

    // Set up auto-refresh
    setInterval(updateDomainList, 5000);
});
