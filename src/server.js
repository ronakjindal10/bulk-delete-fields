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
        const response = await axios.get(`${HIGHLEVEL_API}/locations/`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

app.get('/api/fields/:locationId', async (req, res) => {
    const apiKey = req.headers.authorization;
    
    try {
        const response = await axios.get(`${HIGHLEVEL_API}/locations/${req.params.locationId}/custom-fields`, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch custom fields' });
    }
});

app.delete('/api/fields/:locationId/:fieldId', async (req, res) => {
    const apiKey = req.headers.authorization;
    
    try {
        await axios.delete(
            `${HIGHLEVEL_API}/locations/${req.params.locationId}/custom-fields/${req.params.fieldId}`,
            { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete field' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 