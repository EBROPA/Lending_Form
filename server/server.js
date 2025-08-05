require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✔ MongoDB connected'))
.catch(err => console.error('✖ MongoDB error:', err));

const leadSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Lead = mongoose.model('Lead', leadSchema);

app.post('/api/lead', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).send('Телефон обязателен');

  try {
    const lead = await Lead.create({ phone });
    console.log(`New lead saved: ${lead.phone}`);

    // await sendToAmoCRM(lead.phone);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error in /api/lead:', err);
    res.status(500).send('Server error');
  }
});

async function sendToAmoCRM(phone) {
  const token = process.env.AMOCRM_ACCESS_TOKEN;
  const account = process.env.AMOCRM_ACCOUNT;
  const phoneFieldId = process.env.AMOCRM_PHONE_FIELD_ID;

  const data = {
    name: `Лид ${phone}`,
    custom_fields_values: [
      {
        field_id: phoneFieldId,
        values: [{ value: phone, enum_code: 'MOB' }],
      },
    ],
  };

  try {
    const response = await axios.post(
      `https://${account}.amocrm.ru/api/v4/contacts`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✔ Lead sent to amoCRM:', response.data);
  } catch (error) {
    console.error('✖ Failed to send lead to amoCRM:', error.response?.data || error.message);
  }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
