const axios = require('axios');

module.exports = async (req, res) => {
  // CORS 에러 방지 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { text, target_lang, auth_key } = req.body;

  try {
    const response = await axios.post('https://api-free.deepl.com/v2/translate', 
      new URLSearchParams({ auth_key, text, target_lang }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
