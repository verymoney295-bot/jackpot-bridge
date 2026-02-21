module.exports = async (req, res) => {
  // 어떤 사이트에서도 접속할 수 있게 문을 열어줍니다
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 브라우저에서 그냥 접속하거나 미리보기 요청(OPTIONS)일 때 처리
  if (req.method === 'OPTIONS' || req.method === 'GET') {
    return res.status(200).send("번역 서버가 정상 가동 중입니다. 사냥을 시작하세요!");
  }

  // 데이터 추출 (데이터가 없을 경우를 대비해 빈 객체 기본값 설정)
  const { text, target_lang, auth_key } = req.body || {};

  if (!text || !auth_key) {
    return res.status(400).json({ error: "필수 데이터(text, auth_key)가 누락되었습니다." });
  }

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
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
