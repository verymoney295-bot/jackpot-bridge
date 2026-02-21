module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS,GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).send("번역 서버 정상 작동 중!");

  try {
    // 🎯 데이터를 더 안정적으로 읽어오는 로직
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    
    const { text, target_lang, auth_key } = body || {};

    if (!auth_key) throw new Error("DeepL API 키가 서버로 전달되지 않았습니다.");

    // 무료/유료 키 자동 판별
    const domain = auth_key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';
    
    const response = await fetch(`https://${domain}/v2/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ auth_key, text, target_lang }).toString()
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || "DeepL 서버 응답 에러");
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
