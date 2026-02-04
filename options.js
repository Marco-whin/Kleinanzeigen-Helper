// Firefox compatibility
const storageAPI = typeof browser !== 'undefined' ? browser.storage : chrome.storage;
const tabsAPI = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;

// Default templates
const DEFAULT_TEMPLATES = [
  {
    id: 'default-1',
    name: 'Verfügbarkeit',
    text: 'Hallo, ist der Artikel noch verfügbar?'
  },
  {
    id: 'default-2',
    name: 'Preis verhandeln',
    text: 'Hallo, ich interessiere mich für den Artikel. Wäre der Preis noch verhandelbar?'
  },
  {
    id: 'default-3',
    name: 'Abholung',
    text: 'Hallo, ich würde den Artikel gerne abholen. Wann wäre das möglich?'
  },
  {
    id: 'default-4',
    name: 'Versand',
    text: 'Hallo, würden Sie den Artikel auch versenden? Ich würde die Versandkosten übernehmen.'
  }
];

let currentEditId = null;

// Default settings
const DEFAULT_SETTINGS = {
  hideButton: true,
  showTemplates: true,
  undoNotification: true
};

// Initialize with defaults if empty
storageAPI.sync.get(['templates', 'settings']).then((result) => {
  if (!result.templates || result.templates.length === 0) {
    storageAPI.sync.set({ templates: DEFAULT_TEMPLATES }).then(loadTemplates);
  } else {
    loadTemplates();
  }
  
  if (!result.settings) {
    storageAPI.sync.set({ settings: DEFAULT_SETTINGS }).then(loadSettings);
  } else {
    loadSettings();
  }
});

// Load and display templates
function loadTemplates() {
  storageAPI.sync.get(['templates', 'hiddenAds']).then((result) => {
    const templates = result.templates || [];
    const hiddenAds = result.hiddenAds || [];
    
    // Update stats
    document.getElementById('templateCount').textContent = templates.length;
    document.getElementById('hiddenCount').textContent = hiddenAds.length;
    
    const templatesList = document.getElementById('templatesList');
    
    // Clear existing content
    while (templatesList.firstChild) {
      templatesList.removeChild(templatesList.firstChild);
    }
    
    if (templates.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      
      const icon = document.createElement('div');
      icon.className = 'empty-state-icon';
      icon.textContent = '📝';
      
      const p1 = document.createElement('p');
      p1.textContent = 'Noch keine Vorlagen erstellt';
      
      const p2 = document.createElement('p');
      p2.style.fontSize = '13px';
      p2.style.marginTop = '8px';
      p2.textContent = 'Erstelle deine erste Vorlage oben!';
      
      emptyState.appendChild(icon);
      emptyState.appendChild(p1);
      emptyState.appendChild(p2);
      templatesList.appendChild(emptyState);
      return;
    }
    
    templates.forEach(template => {
      const card = document.createElement('div');
      card.className = 'template-card';
      
      const header = document.createElement('div');
      header.className = 'template-header';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'template-name';
      nameDiv.textContent = template.name;
      
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'template-actions';
      
      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn edit-btn';
      editBtn.dataset.id = template.id;
      editBtn.title = 'Bearbeiten';
      editBtn.textContent = '✏️';
      editBtn.addEventListener('click', () => editTemplate(template.id));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'icon-btn delete-btn';
      deleteBtn.dataset.id = template.id;
      deleteBtn.title = 'Löschen';
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => deleteTemplate(template.id));
      
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);
      
      header.appendChild(nameDiv);
      header.appendChild(actionsDiv);
      
      const textDiv = document.createElement('div');
      textDiv.className = 'template-text';
      textDiv.textContent = template.text;
      
      card.appendChild(header);
      card.appendChild(textDiv);
      
      templatesList.appendChild(card);
    });
  });
}

// Add new template
document.getElementById('addTemplate').addEventListener('click', () => {
  const name = document.getElementById('templateName').value.trim();
  const text = document.getElementById('templateText').value.trim();
  
  if (!name || !text) {
    alert('Bitte beide Felder ausfüllen!');
    return;
  }
  
  storageAPI.sync.get(['templates']).then((result) => {
    const templates = result.templates || [];
    const newTemplate = {
      id: 'custom-' + Date.now(),
      name: name,
      text: text
    };
    
    templates.push(newTemplate);
    storageAPI.sync.set({ templates }).then(() => {
      document.getElementById('templateName').value = '';
      document.getElementById('templateText').value = '';
      loadTemplates();
      showSuccess();
    });
  });
});

// Edit template
function editTemplate(id) {
  storageAPI.sync.get(['templates']).then((result) => {
    const templates = result.templates || [];
    const template = templates.find(t => t.id === id);
    
    if (!template) return;
    
    currentEditId = id;
    document.getElementById('editName').value = template.name;
    document.getElementById('editText').value = template.text;
    document.getElementById('editModal').classList.add('active');
  });
}

// Save edited template
document.getElementById('saveEdit').addEventListener('click', () => {
  const name = document.getElementById('editName').value.trim();
  const text = document.getElementById('editText').value.trim();
  
  if (!name || !text) {
    alert('Bitte beide Felder ausfüllen!');
    return;
  }
  
  storageAPI.sync.get(['templates']).then((result) => {
    const templates = result.templates || [];
    const index = templates.findIndex(t => t.id === currentEditId);
    
    if (index !== -1) {
      templates[index].name = name;
      templates[index].text = text;
      
      storageAPI.sync.set({ templates }).then(() => {
        closeModal();
        loadTemplates();
        showSuccess();
      });
    }
  });
});

// Cancel edit
document.getElementById('cancelEdit').addEventListener('click', closeModal);

// Close modal on background click
document.getElementById('editModal').addEventListener('click', (e) => {
  if (e.target.id === 'editModal') {
    closeModal();
  }
});

function closeModal() {
  document.getElementById('editModal').classList.remove('active');
  currentEditId = null;
}

// Delete template
function deleteTemplate(id) {
  if (!confirm('Möchtest du diese Vorlage wirklich löschen?')) return;
  
  storageAPI.sync.get(['templates']).then((result) => {
    const templates = (result.templates || []).filter(t => t.id !== id);
    storageAPI.sync.set({ templates }).then(() => {
      loadTemplates();
      showSuccess();
    });
  });
}

// Clear hidden ads
document.getElementById('clearHidden').addEventListener('click', () => {
  if (!confirm('Möchtest du alle ausgeblendeten Anzeigen zurücksetzen?')) return;
  
  storageAPI.sync.set({ hiddenAds: [] }).then(() => {
    loadTemplates();
    showSuccess();
    
    // Refresh all Kleinanzeigen tabs
    tabsAPI.query({ url: 'https://www.kleinanzeigen.de/*' }).then((tabs) => {
      tabs.forEach(tab => tabsAPI.reload(tab.id));
    });
  });
});

// Show success message
function showSuccess() {
  const msg = document.getElementById('successMessage');
  msg.classList.add('show');
  setTimeout(() => {
    msg.classList.remove('show');
  }, 3000);
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load settings
function loadSettings() {
  storageAPI.sync.get(['settings']).then((result) => {
    const settings = result.settings || DEFAULT_SETTINGS;
    
    document.getElementById('settingHideButton').checked = settings.hideButton !== false;
    document.getElementById('settingShowTemplates').checked = settings.showTemplates !== false;
    document.getElementById('settingUndoNotification').checked = settings.undoNotification !== false;
  });
}

// Save settings
function saveSettings() {
  const settings = {
    hideButton: document.getElementById('settingHideButton').checked,
    showTemplates: document.getElementById('settingShowTemplates').checked,
    undoNotification: document.getElementById('settingUndoNotification').checked
  };
  
  storageAPI.sync.set({ settings }).then(() => {
    showSuccess();
    
    // Refresh all Kleinanzeigen tabs to apply settings
    tabsAPI.query({ url: 'https://www.kleinanzeigen.de/*' }).then((tabs) => {
      tabs.forEach(tab => tabsAPI.reload(tab.id));
    });
  });
}

// Add event listeners for settings
document.getElementById('settingHideButton').addEventListener('change', saveSettings);
document.getElementById('settingShowTemplates').addEventListener('change', saveSettings);
document.getElementById('settingUndoNotification').addEventListener('change', saveSettings);
