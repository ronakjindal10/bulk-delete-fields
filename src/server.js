const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('src/public'));

const PORT = process.env.PORT || 3000;
const HIGHLEVEL_API = 'https://api.gohighlevel.com/v1';

// API endpoints
app.get('/api/locations', async (req, res) => {
    const apiKey = req.headers.authorization;
    
    try {
        console.log('Fetching locations...');
        const response = await axios.get(`${HIGHLEVEL_API}/locations/`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        console.log('Locations fetched successfully');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching locations:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Failed to fetch locations',
            details: error.response?.data || error.message
        });
    }
});

app.get('/api/fields/:locationId', async (req, res) => {
    const apiKey = req.headers.authorization;
    
    try {
        console.log(`Fetching fields for location ${req.params.locationId}...`);
        const response = await axios.get(`${HIGHLEVEL_API}/locations/${req.params.locationId}/custom-fields`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        console.log('Fields fetched successfully');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching fields:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Failed to fetch custom fields',
            details: error.response?.data || error.message
        });
    }
});

app.delete('/api/fields/:locationId/:fieldId', async (req, res) => {
    const apiKey = req.headers.authorization;
    
    try {
        console.log(`Deleting field ${req.params.fieldId} from location ${req.params.locationId}...`);
        await axios.delete(
            `${HIGHLEVEL_API}/locations/${req.params.locationId}/custom-fields/${req.params.fieldId}`,
            { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        console.log('Field deleted successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting field:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Failed to delete field',
            details: error.response?.data || error.message
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 