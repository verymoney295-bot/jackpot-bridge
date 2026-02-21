module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    const { text, target_lang, auth_key } = body || {};

    if (!auth_key) return res.status(400).json({ error: "API 키 누락" });

    // 🎯 무료/유료 주소 자동 판별
    const domain = auth_key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';

    const response = await fetch(`https://${domain}/v2/translate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${auth_key}` // 🎯 최신 헤더 인증 방식 적용
      },
      body: new URLSearchParams({ text, target_lang }).toString()
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
