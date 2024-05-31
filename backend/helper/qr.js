const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify')(new JSDOM().window);

exports.sendQRimage = (imageUrl, email) => {
   const qrcode = `
   <!DOCTYPE html>
<html>
<head>
  <title>Multi Factor Authentication</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    }
    
    .otp-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }
    
    .otp-input {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    
    .otp-input input {
      width: 40px;
      height: 40px;
      font-size: 24px;
      text-align: center;
      margin: 0 5px;
    }
    
    #qr-code {
      margin-top: 20px;
    }

    #qr-code-image {
      width: 300px;
      height: 300px;
    }

    #generate-btn {
      display: block;
      margin-top: 5px;
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    #generate-btn:hover {
      background-color: #45a049;
    }
    .otp-input input {
    width: 200px;
    height: 50px;
    font-size: 32px;
    text-align: center;
    border: 2px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s;
    margin-bottom: 20px;
    }

    .otp-input input:focus {
    border-color: #007bff;
    }
  </style>
</head>
<body>
  <h1>Tải ứng dụng Google Authenticator và quét mã QR bên dưới</h1>
  
  <div class="otp-container">
    <div id="qr-code">
        <img src="${imageUrl}" id="qr-code-image" alt="QR Code">
      </div>
  <p style="color: red">Enter the 6-digit OTP show on Google Authenticator</p>
    <div class="otp-input">
      <input type="text" id="otp" maxlength="6" placeholder="OTP" required>
    </div>
    <button id="generate-btn" data-email=${email} onclick=verify(this)>Xác nhận</button>
  </div>  
</body>
<script>
function verify(element) {
    const otp = document.getElementById("otp").value;
    const email = element.dataset.email
    fetch('${process.env.REACT_APP_BACKEND_URL}/account/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, otp: otp})
      })
       .then(response => {
            if (response.status != 200) {
                return response.json()
            } else {
                window.location.href = '/'
            }
        })
        .then(data => {
            errorMessage.textContent = data.message;
        })
}
</script>
</html>`
 const cleanHtml = DOMPurify.sanitize(qrcode, {
    FORCE_BODY: true,
    ALLOWED_TAGS: ['script', 'div', 'p', 'a', 'img', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'style', 'button', 'input'],
    ALLOWED_ATTR: ['src', 'href', 'title', 'style', 'id', 'class', 'value', 'data-email', 'onclick']
    //SAFE_SRC_PATTERN: /^(https?:|data:image\/.*|blob:)/
  })
  return cleanHtml
};
