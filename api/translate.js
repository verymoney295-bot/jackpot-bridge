module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 🎯 어떤 방식으로 데이터가 들어와도 읽을 수 있게 처리
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { text, target_lang, auth_key } = body || {};

  if (!text || !auth_key) {
    return res.status(400).json({ error: "데이터 누락" });
  }

  try {
    // 🎯 키 형식에 따라 주소 자동 선택 (무료 :fx / 유료 일반)
    const domain = auth_key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';
    const apiUrl = `https://${domain}/v2/translate`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ auth_key, text, target_lang }).toString()
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
