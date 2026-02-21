module.exports = async (req, res) => {
  // 어떤 사이트에서도 형님의 서버에 접속할 수 있게 문을 열어줍니다
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { text, target_lang, auth_key } = req.body;

  try {
    // 외부 도구(axios) 없이 바로 딥엘(DeepL)에 요청을 쏩니다
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
