let selectedFields = new Set();
let locations = [];
let apiKey = '';

async function handleLogin(event) {
    event.preventDefault();
    apiKey = document.getElementById('apiKey').value;
    
    try {
        // Test API key by fetching locations
        const response = await fetchLocations();
        if (response.locations) {
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('fieldSelector').classList.remove('hidden');
            locations = response.locations;
            const fields = await fetchFields(locations[0].id);
            displayFields(fields);
        }
    } catch (error) {
        alert('Invalid API key or error connecting to HighLevel');
    }
}

async function fetchLocations() {
    const response = await fetch('/api/locations', {
        headers: { 'Authorization': apiKey }
    });
    const data = await response.json();
    return data;
}

async function fetchFields(locationId) {
    const response = await fetch(`/api/fields/${locationId}`, {
        headers: { 'Authorization': apiKey }
    });
    const data = await response.json();
    return data.customFields;
}

function displayFields(fields) {
    const fieldList = document.getElementById('fieldList');
    fieldList.innerHTML = fields.map(field => `
        <div class="flex items-center space-x-3">
            <input type="checkbox" 
                   id="${field.id}" 
                   value="${field.id}"
                   onchange="toggleField('${field.id}')"
                   class="h-4 w-4">
            <label for="${field.id}" class="flex-1">
                ${field.name} <span class="text-gray-500">(${field.type})</span>
            </label>
        </div>
    `).join('');
}

function toggleField(fieldId) {
    if (selectedFields.has(fieldId)) {
        selectedFields.delete(fieldId);
    } else {
        selectedFields.add(fieldId);
    }
}

async function previewDeletion() {
    if (selectedFields.size === 0) {
        alert('Please select at least one field to delete');
        return;
    }

    const preview = document.getElementById('preview');
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = `
        <p>You are about to delete ${selectedFields.size} field(s) across ${locations.length} locations.</p>
        <p class="text-red-600 mt-2">This action cannot be undone!</p>
    `;
    
    preview.classList.remove('hidden');
}

function cancelDeletion() {
    document.getElementById('preview').classList.add('hidden');
}

async function executeDelete() {
    const progress = document.getElementById('progress');
    const progressContent = document.getElementById('progressContent');
    progress.classList.remove('hidden');
    
    for (const location of locations) {
        for (const fieldId of selectedFields) {
            try {
                await fetch(`/api/fields/${location.id}/${fieldId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': apiKey }
                });
                progressContent.innerHTML += `
                    <div class="text-green-600">✓ Deleted field ${fieldId} from location ${location.id}</div>
                `;
            } catch (error) {
                progressContent.innerHTML += `
                    <div class="text-red-600">✗ Failed to delete field ${fieldId} from location ${location.id}</div>
                `;
            }
        }
    }
    
    progressContent.innerHTML += `
        <div class="font-bold mt-4">Operation complete!</div>
    `;
} 