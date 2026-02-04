// Content script for Kleinanzeigen - Firefox compatible
console.log('Kleinanzeigen Helper (Firefox) loaded - v2.1');

// Firefox compatibility: use browser API
const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;

// Storage for templates and hidden ads
let templates = [];
let hiddenAds = [];
let settings = {
  hideButton: true,
  showTemplates: true,
  undoNotification: true
};

// Load data from storage
storageAPI.sync.get(['templates', 'hiddenAds', 'settings']).then((result) => {
  templates = result.templates || [];
  hiddenAds = result.hiddenAds || [];
  settings = result.settings || settings;
  
  // Apply hidden ads filter
  applyHiddenAdsFilter();
  
  // Add template buttons to message forms (if enabled)
  if (settings.showTemplates) {
    addTemplateButtons();
  }
  
  // Add hide buttons to ad listings (if enabled)
  if (settings.hideButton) {
    addHideButtons();
  }
});

// Listen for storage changes
storageAPI.onChanged.addListener((changes, namespace) => {
  if (changes.templates) {
    templates = changes.templates.newValue || [];
    if (settings.showTemplates) {
      addTemplateButtons();
    }
  }
  if (changes.hiddenAds) {
    hiddenAds = changes.hiddenAds.newValue || [];
    applyHiddenAdsFilter();
  }
  if (changes.settings) {
    settings = changes.settings.newValue || settings;
    // Settings changed - reload page to apply
    console.log('Settings changed, reloading needed');
  }
});

// Add template buttons to message input areas
function addTemplateButtons() {
  // Check if feature is enabled
  if (!settings.showTemplates) {
    return;
  }
  
  // Look for message textarea or input fields - comprehensive selectors for all Kleinanzeigen pages
  const messageAreas = document.querySelectorAll(`
    textarea[name="message"],
    textarea[placeholder*="Nachricht"],
    textarea[placeholder*="nachricht"],
    textarea[placeholder*="Antwort"],
    textarea[placeholder*="antwort"],
    textarea[placeholder*="freundliche"],
    textarea[id*="message"],
    textarea[id*="reply"],
    textarea[class*="message"],
    textarea[class*="reply"],
    textarea[class*="text"],
    #message-text,
    #message-textarea-input,
    .messagebox textarea,
    [data-testid*="message"] textarea,
    form[action*="message"] textarea,
    form[action*="reply"] textarea,
    div[class*="conversation"] textarea,
    div[class*="chat"] textarea,
    textarea
  `);
  
  messageAreas.forEach((textarea, index) => {
    // Check if we already added buttons - look for actual button container that is still in DOM
    let hasButtons = false;
    if (textarea.nextSibling && textarea.nextSibling.classList) {
      hasButtons = textarea.nextSibling.classList.contains('ka-helper-templates');
    }
    if (!hasButtons && textarea.previousSibling && textarea.previousSibling.classList) {
      hasButtons = textarea.previousSibling.classList.contains('ka-helper-templates');
    }
    
    if (hasButtons) {
      return;
    }
    
    // Get dimensions
    const rect = textarea.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(textarea);
    const isVisible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
    
    // More flexible size check - allow smaller textareas if they're visible or have relevant attributes
    const hasRelevantAttributes = 
      textarea.name === 'message' ||
      textarea.id === 'message-textarea-input' ||
      textarea.placeholder?.toLowerCase().includes('nachricht') ||
      textarea.placeholder?.toLowerCase().includes('antwort') ||
      textarea.id?.includes('message');
    
    const isBigEnough = rect.width > 50 && rect.height > 20;
    
    if (!isBigEnough && !hasRelevantAttributes) {
      return;
    }
    
    // Skip hidden elements unless they have relevant attributes (might become visible later)
    if (!isVisible && rect.width === 0 && rect.height === 0 && !hasRelevantAttributes) {
      return;
    }
    
    // Create container for template buttons
    const container = document.createElement('div');
    container.className = 'ka-helper-templates';
    container.style.cssText = `
      margin-top: 8px;
      margin-bottom: 8px;
      padding: 8px;
      background: #f0f7ff;
      border-radius: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      position: relative;
      z-index: 1000;
      clear: both;
    `;
    
    // Add template buttons
    templates.forEach(template => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ka-helper-template-btn';
      btn.textContent = template.name;
      btn.style.cssText = `
        padding: 6px 12px;
        background: #0066cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
      `;
      
      btn.addEventListener('mouseenter', () => {
        btn.style.background = '#0052a3';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.background = '#0066cc';
      });
      
      btn.addEventListener('click', () => {
        // Insert template text
        const currentValue = textarea.value;
        const newValue = currentValue ? currentValue + '\n\n' + template.text : template.text;
        textarea.value = newValue;
        
        // Trigger input event for React/Vue forms
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Focus textarea
        textarea.focus();
        
        // Visual feedback
        btn.style.background = '#00aa00';
        setTimeout(() => {
          btn.style.background = '#0066cc';
        }, 300);
      });
      
      container.appendChild(btn);
    });
    
    // Insert buttons before textarea (above it) so it's always visible
    try {
      textarea.parentNode.insertBefore(container, textarea);
    } catch (error) {
      // Silently fail if insertion doesn't work
    }
  });
}

// Add hide buttons to ad listings
function addHideButtons() {
  // Check if feature is enabled
  if (!settings.hideButton) {
    return;
  }
  
  // Find ad listings (this selector might need adjustment based on Kleinanzeigen's structure)
  const adSelectors = [
    'article[data-adid]',
    '.aditem',
    '.ad-listitem',
    '[class*="adlist"] > li',
    '[class*="adlist"] > div'
  ];
  
  let adElements = [];
  adSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    adElements.push(...elements);
  });
  
  adElements.forEach(adElement => {
    // Skip if already has hide button
    if (adElement.dataset.hideButtonAdded) return;
    adElement.dataset.hideButtonAdded = 'true';
    
    // Try to get ad ID
    const adId = adElement.dataset.adid || 
                 adElement.getAttribute('data-ad-id') ||
                 adElement.id ||
                 extractAdIdFromLinks(adElement);
    
    if (!adId) return;
    
    // Create hide button (smaller, less intrusive)
    const hideBtn = document.createElement('button');
    hideBtn.className = 'ka-helper-hide-btn';
    hideBtn.innerHTML = '✕';
    hideBtn.title = 'Diese Anzeige ausblenden';
    hideBtn.style.cssText = `
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 4px 8px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #ddd;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      z-index: 10;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: all 0.2s;
    `;
    
    hideBtn.addEventListener('mouseenter', () => {
      hideBtn.style.background = '#ffebee';
      hideBtn.style.borderColor = '#ff6b6b';
      hideBtn.style.opacity = '1';
      hideBtn.style.transform = 'scale(1.1)';
    });
    
    hideBtn.addEventListener('mouseleave', () => {
      hideBtn.style.background = 'rgba(255, 255, 255, 0.9)';
      hideBtn.style.borderColor = '#ddd';
      hideBtn.style.opacity = '0.6';
      hideBtn.style.transform = 'scale(1)';
    });
    
    hideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideAd(adId, adElement);
    });
    
    // Make sure parent has relative positioning
    if (getComputedStyle(adElement).position === 'static') {
      adElement.style.position = 'relative';
    }
    
    adElement.appendChild(hideBtn);
  });
}

// Extract ad ID from links within the element
function extractAdIdFromLinks(element) {
  const links = element.querySelectorAll('a[href*="/s-anzeige/"]');
  for (const link of links) {
    const match = link.href.match(/\/s-anzeige\/[^\/]+\/(\d+)/);
    if (match) return match[1];
  }
  return null;
}

// Hide an ad with undo option
function hideAd(adId, adElement) {
  // Add to hidden list
  if (!hiddenAds.includes(adId)) {
    hiddenAds.push(adId);
    storageAPI.sync.set({ hiddenAds });
  }
  
  // Hide the element with animation
  adElement.style.transition = 'opacity 0.3s, transform 0.3s';
  adElement.style.opacity = '0';
  adElement.style.transform = 'scale(0.95)';
  
  // If undo notification is disabled, hide immediately
  if (!settings.undoNotification) {
    setTimeout(() => {
      adElement.style.display = 'none';
    }, 300);
    return;
  }
  
  // Create undo notification
  const undoNotification = document.createElement('div');
  undoNotification.className = 'ka-helper-undo-notification';
  undoNotification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #333;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 15px;
    animation: slideIn 0.3s ease;
  `;
  
  undoNotification.innerHTML = `
    <span>Anzeige ausgeblendet</span>
    <button id="undoBtn" style="
      background: #0066cc;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
    ">Rückgängig (<span id="countdown">5</span>s)</button>
  `;
  
  document.body.appendChild(undoNotification);
  
  let countdown = 5;
  const countdownEl = undoNotification.querySelector('#countdown');
  const undoBtn = undoNotification.querySelector('#undoBtn');
  
  let undone = false;
  
  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdownEl) countdownEl.textContent = countdown;
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      if (!undone) {
        adElement.style.display = 'none';
        undoNotification.remove();
      }
    }
  }, 1000);
  
  // Undo button
  undoBtn.addEventListener('click', () => {
    undone = true;
    clearInterval(countdownInterval);
    
    // Remove from hidden list
    hiddenAds = hiddenAds.filter(id => id !== adId);
    storageAPI.sync.set({ hiddenAds });
    
    // Show the element again
    adElement.style.opacity = '1';
    adElement.style.transform = 'scale(1)';
    
    // Remove notification
    undoNotification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => undoNotification.remove(), 300);
  });
  
  // Auto-remove after timeout
  setTimeout(() => {
    if (!undone && adElement.style.opacity === '0') {
      adElement.style.display = 'none';
    }
    if (undoNotification.parentNode) {
      undoNotification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => undoNotification.remove(), 300);
    }
  }, 5000);
}

// Apply hidden ads filter
function applyHiddenAdsFilter() {
  if (hiddenAds.length === 0) return;
  
  // Find all ads and hide the ones in the hidden list
  const adSelectors = [
    'article[data-adid]',
    '.aditem',
    '.ad-listitem',
    '[class*="adlist"] > li',
    '[class*="adlist"] > div'
  ];
  
  adSelectors.forEach(selector => {
    const adElements = document.querySelectorAll(selector);
    adElements.forEach(adElement => {
      const adId = adElement.dataset.adid || 
                   adElement.getAttribute('data-ad-id') ||
                   adElement.id ||
                   extractAdIdFromLinks(adElement);
      
      if (adId && hiddenAds.includes(adId)) {
        adElement.style.display = 'none';
      }
    });
  });
}

// Re-run when page content changes (for dynamic loading) - with throttling to avoid performance issues
let observerTimeout = null;
const observer = new MutationObserver(() => {
  // Throttle: only run once every 500ms
  if (observerTimeout) return;
  
  observerTimeout = setTimeout(() => {
    if (settings.showTemplates) {
      addTemplateButtons();
    }
    if (settings.hideButton) {
      addHideButtons();
    }
    applyHiddenAdsFilter();
    observerTimeout = null;
  }, 500);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial setup with delays to catch lazy-loaded content
setTimeout(() => {
  if (settings.showTemplates) {
    addTemplateButtons();
  }
  if (settings.hideButton) {
    addHideButtons();
  }
  applyHiddenAdsFilter();
}, 1000);

// Check again after 3 seconds (for slower page loads)
setTimeout(() => {
  if (settings.showTemplates) {
    addTemplateButtons();
  }
  if (settings.hideButton) {
    addHideButtons();
  }
}, 3000);
