import axios from 'axios';

async function toHiragana(sentence, output_type = 'hiragana') {
  const app_id = localStorage.getItem("hiragana_api_key");
  if (app_id === null) {
    return sentence;
  }

  try {
    const response = await axios.post('https://labs.goo.ne.jp/api/hiragana', {
      app_id,
      sentence,
      output_type
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error calling Hiragana API:', error);
    return sentence;
  }
}

export default toHiragana
