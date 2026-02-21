module.exports = async (req, res) => {
  // 1. CORS 설정 (어디서든 접속 가능하게)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 2. 데이터 수신 (JSON이든 아니든 일단 다 받기)
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { /* 무시 */ }
    }
    
    const { text, target_lang, auth_key } = body || {};

    // 데이터가 없으면 구체적으로 알려주기
    if (!text || !auth_key) {
      return res.status(400).json({ error: "필수 데이터(text 또는 auth_key)가 서버로 전달되지 않았습니다." });
    }

    // 3. DeepL 주소 결정 (무료/유료 자동 판별)
    const domain = auth_key.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com';
    const apiUrl = `https://${domain}/v2/translate`;

    // 4. 번역 요청 전송
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ auth_key, text, target_lang }).toString()
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || "DeepL API 에러 발생" });
    }

    // 5. 성공 결과 전송
    res.status(200).json(data);

  } catch (error) {
    // 6. 서버가 왜 죽었는지 상세히 알려주기 (이게 500 에러를 방지함)
    res.status(500).json({ 
      error: "서버 내부 에러 발생", 
      message: error.message 
    });
  }
};
