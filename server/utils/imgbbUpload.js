const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

async function uploadToImgBB(filePath) {
  const form = new FormData();
  const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });
  form.append('image', fileContent);

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    form,
    { headers: form.getHeaders() }
  );

  if (response.data.success) {
    return response.data.data.url;
  } else {
    throw new Error(response.data.error.message);
  }
}

module.exports = uploadToImgBB;
