exports.sendDashBoard = (users, posts) => {
    var content_user = ''
    for(var i=0; i<users.length; i++) {
       const data = `
         <tr>
         <td>${users[i].name}</td>
         <td>${users[i].email}</td>
         <td>${users[i].status}</td>
         <td>
           <button data-user="${users[i]._id}" class="btn ${users[i].status === 'active' ? 'btn-danger' : ''}" 
             onclick="${users[i].status === 'active' ? 'lockAccount(this)' : 'activeAccount(this)'}">
             ${users[i].status === 'active' ? 'lock' : 'active'}
           </button>
         </td>
         </tr>`
         content_user = content_user + data
    }
    var content_post = ''
    for(var i=0; i<posts.length; i++) {
       const container = `
         <tr>
         <td>${posts[i].title}</td>
         <td>${posts[i].user.email}</td>
         <td>
             <button data-post="${posts[i]._id}"  class="btn btn-danger" onclick="deletePost(this)">Delete</button>
         </td>
         </tr>`
         content_post = content_post + container
    }
    const html = `
    <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Admin Dashboard</title>
   <style>
     /* CSS styles */
     body {
       font-family: Arial, sans-serif;
       margin: 0;
       padding: 0;
       background-color: #f0f0f0;
     }
     .container {
       max-width: 1200px;
       margin: 0 auto;
       padding: 20px;
     }
     h1, h2 {
       text-align: center;
       margin-bottom: 20px;
     }
     table {
       width: 100%;
       border-collapse: collapse;
       background-color: white;
       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
     }
     th, td {
       padding: 10px;
       text-align: left;
       border-bottom: 1px solid #ddd;
     }
     th {
       background-color: #f0f0f0;
     }
     .btn {
       padding: 8px 16px;
       background-color: #4CAF50;
       color: white;
       border: none;
       border-radius: 4px;
       cursor: pointer;
     }
     .btn-danger {
       background-color: #f44336;
     }
     .btn:hover {
       background-color: #45a049;
     }
     .btn-danger:hover {
       background-color: #c62828;
     }
   </style>
 </head>
 <body>
 <button style="float: right" class="btn btn-danger" 
 onclick="logout()">
 Logout
 </button>
   <div class="container">
     <h1>Admin Dashboard</h1>
     <h2>User Accounts</h2>
     <table id="userTable">
       <thead>
         <tr>
           <th>Username</th>
           <th>Email</th>
           <th>Status</th>
           <th>Actions</th>
         </tr>
       </thead>
       <tbody>
         ${content_user}
       </tbody>
     </table>
 
     <h2>User Posts</h2>
     <table id="postTable">
       <thead>
         <tr>
           <th>Title</th>
           <th>Author</th>
           <th>Actions</th>
         </tr>
         ${content_post}
       </thead>
       <tbody>
 
       </tbody>
     </table>
   </div>
 
   <script>
     function deletePost(element) {
         const id = element.dataset.post
         console.log(id)
         fetch('${process.env.REACT_APP_BACKEND_URL}/post?postid='+id, {
             method: 'DELETE'
         })
         .then(response => {
             if (response.status != 200) {
                 return response.json()
             } else {
                 alert('Success Delete Post!')
                 location.reload(true)
             }
         })
         .then(data => {
             alert('Failed Delete Post! Error:', data.msg)
         })
     }
 
     function lockAccount(element) {
         fetch('${process.env.REACT_APP_BACKEND_URL}/admin/user', {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({id: element.dataset.user, type: 'lock'})
         })
         .then(response => {
             if (response.status != 200) {
                 return response.json()
             } else {
                 alert('Success Block User!')
                 location.reload(true)
             }
         })
         .then(data => {
             alert('Failed Block User! Error:', data.msg)
         })
     }
 
     function activeAccount(element) {
         fetch('${process.env.REACT_APP_BACKEND_URL}/admin/user', {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({id: element.dataset.user, type:'active'})
         })
         .then(response => {
             if (response.status != 200) {
                 return response.json()
             } else {
                 alert('Success Active User!')
                 location.reload(true)
             }
         })
         .then(data => {
             alert('Failed Active User! Error:', data.msg)
         })
     }
 
     function logout() {
       fetch('${process.env.REACT_APP_BACKEND_URL}/logout', {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       })
       .then(response => {
           if (response.status != 200) {
               return response.json()
           } else {
               alert('Success logout User!')
               window.location.href = '/admin/login'
           }
       })
       .then(data => {
           alert('Failed Active User! Error:', data.msg)
       })
   }
   </script>
 </body>
 </html>`
     return html
 }
 
 exports.sendLoginPage = () => {
     const html = `
     <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Admin Login</title>
   <style>
     body {
       font-family: Arial, sans-serif;
       background-color: #f2f2f2;
       margin: 0;
       padding: 0;
     }
 
     .container {
       display: flex;
       justify-content: center;
       align-items: center;
       height: 100vh;
     }
 
     .login-box {
       background-color: white;
       padding: 40px;
       border-radius: 5px;
       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
       max-width: 400px;
       width: 100%;
     }
 
     .login-box h2 {
       text-align: center;
       margin-bottom: 20px;
     }
 
     .form-group {
       margin-bottom: 20px;
     }
 
     .form-group label {
       display: block;
       font-weight: bold;
       margin-bottom: 5px;
     }
 
     .form-group input {
       width: 100%;
       padding: 10px;
       border: 1px solid #ccc;
       border-radius: 4px;
       box-sizing: border-box;
     }
 
     .btn {
       background-color: #4CAF50;
       color: white;
       padding: 10px 20px;
       border: none;
       border-radius: 4px;
       cursor: pointer;
       width: 100%;
     }
 
     .btn:hover {
       background-color: #45a049;
     }
 
     .error-message {
       color: red;
       font-weight: bold;
       margin-top: 10px;
       text-align: center;
     }
   </style>
 </head>
 <body>
   <div class="container">
     <div class="login-box">
       <h2>Admin Login</h2>
       <form id="login-form">
         <div class="form-group">
           <label for="username">Email:</label>
           <input type="text" id="username" name="username" placeholder="Enter your email" required>
         </div>
         <div class="form-group">
           <label for="password">Password:</label>
           <input type="password" id="password" name="password" placeholder="Enter your password" required>
         </div>
         <div class="form-group">
           <label for="otp">OTP:</label>
           <input type="otp" id="otp" name="otp" placeholder="Enter otp on google authenticator" required>
         </div>
         <button type="submit" class="btn">Login</button>
       </form>
       <div id="error-message" class="error-message"></div>
     </div>
   </div>
 
   <script>
     const form = document.getElementById('login-form');
     const errorMessage = document.getElementById('error-message');
 
     let failedAttempts = 0;
 
     form.addEventListener('submit', (event) => {
       event.preventDefault();
 
       const username = document.getElementById('username').value;
       const password = document.getElementById('password').value;
       const otp = document.getElementById('otp').value;
 
       const data = {
         temail: username,
         password: password,
         otp: otp
       }
 
       fetch('${process.env.REACT_APP_BACKEND_URL}/admin/login', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
       })
        .then(response => {
             if (response.status != 200) {
                 return response.json()
             } else {
                 window.location.href = '/admin'
             }
         })
         .then(data => {
             errorMessage.textContent = data.message;
         })
     });
   </script>
 </body>
 </html>`
     return html
  }
 
  exports.sendRegisterPage = (email, token) => {
     const html = `
     <!DOCTYPE html>
 <html lang="en">
 <head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Register</title>
   <style>
     body {
       font-family: Arial, sans-serif;
       background-color: #f2f2f2;
       margin: 0;
       padding: 0;
     }
 
     .container {
       display: flex;
       justify-content: center;
       align-items: center;
       height: 100vh;
     }
 
     .login-box {
       background-color: white;
       padding: 40px;
       border-radius: 5px;
       box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
       max-width: 400px;
       width: 100%;
     }
 
     .login-box h2 {
       text-align: center;
       margin-bottom: 20px;
     }
 
     .form-group {
       margin-bottom: 20px;
     }
 
     .form-group label {
       display: block;
       font-weight: bold;
       margin-bottom: 5px;
     }
 
     .form-group input {
       width: 100%;
       padding: 10px;
       border: 1px solid #ccc;
       border-radius: 4px;
       box-sizing: border-box;
     }
 
     .btn {
       background-color: #4CAF50;
       color: white;
       padding: 10px 20px;
       border: none;
       border-radius: 4px;
       cursor: pointer;
       width: 100%;
     }
 
     .btn:hover {
       background-color: #45a049;
     }
 
     .error-message {
       color: red;
       font-weight: bold;
       margin-top: 10px;
       text-align: center;
     }
   </style>
 </head>
 <body>
   <div class="container">
     <div class="login-box">
       <h2>Register</h2>
       <form id="login-form">
         <div class="form-group">
           <label for="password">Password:</label>
           <input type="password" id="password" name="password" placeholder="new password" required>
         </div>
         <div class="form-group">
           <label for="confirm-password">Confirm Password:</label>
           <input type="password" id="confirm-password" name="confirm-password" placeholder="confirm password" required>
         </div>
         <input type="hidden" id="email" name="email" value="${email}">
         <input type="hidden" id="token" name="token" value="${token}">
         <button type="submit" class="btn">Confirm</button>
       </form>
       <div id="error-message" class="error-message"></div>
     </div>
   </div>
 
   <script>
     const form = document.getElementById('login-form');
     const errorMessage = document.getElementById('error-message');
 
     let failedAttempts = 0;
 
     form.addEventListener('submit', (event) => {
       event.preventDefault();
 
       const password = document.getElementById('password').value;
       const confirm_password = document.getElementById('confirm-password').value;
       const email = document.getElementById('email').value;
       const token = document.getElementById('token').value;
 
 
       const data = {
         password: password,
         confirm_password: confirm_password,
         email: email,
         token: token
       }
 
       fetch('${process.env.REACT_APP_BACKEND_URL}/register', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
       })
        .then(response => {
             if (response.status != 200) {
                 return response.json()
             } else {
                 alert("Đăng ký thành công")
                 const url = '/account/verify/' + email
                 console.log(url)
                 window.location.href = url
             }
         })
         .then(data => {
             errorMessage.textContent = data.message;
         })
     });
   </script>
 </body>
 </html>`
     return html
  }
 
  exports.sendResetPasswordPage = (email, token) => {
   const html = `
   <!DOCTYPE html>
 <html lang="en">
 <head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Reset Password</title>
 <style>
   body {
     font-family: Arial, sans-serif;
     background-color: #f2f2f2;
     margin: 0;
     padding: 0;
   }
 
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100vh;
   }
 
   .login-box {
     background-color: white;
     padding: 40px;
     border-radius: 5px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
     max-width: 400px;
     width: 100%;
   }
 
   .login-box h2 {
     text-align: center;
     margin-bottom: 20px;
   }
 
   .form-group {
     margin-bottom: 20px;
   }
 
   .form-group label {
     display: block;
     font-weight: bold;
     margin-bottom: 5px;
   }
 
   .form-group input {
     width: 100%;
     padding: 10px;
     border: 1px solid #ccc;
     border-radius: 4px;
     box-sizing: border-box;
   }
 
   .btn {
     background-color: #4CAF50;
     color: white;
     padding: 10px 20px;
     border: none;
     border-radius: 4px;
     cursor: pointer;
     width: 100%;
   }
 
   .btn:hover {
     background-color: #45a049;
   }
 
   .error-message {
     color: red;
     font-weight: bold;
     margin-top: 10px;
     text-align: center;
   }
 </style>
 </head>
 <body>
 <div class="container">
   <div class="login-box">
     <h2>Reset Password</h2>
     <form id="login-form">
       <div class="form-group">
         <label for="password">Password:</label>
         <input type="password" id="password" name="password" placeholder="new password" required>
       </div>
       <div class="form-group">
         <label for="confirm-password">Confirm Password:</label>
         <input type="password" id="confirm-password" name="confirm-password" placeholder="confirm password" required>
       </div>
       <div class="form-group">
         <label for="otp">OTP:</label>
         <input type="text" id="otp" name="otp" placeholder="otp" required>
       </div>
       <input type="hidden" id="email" name="email" value="${email}">
       <input type="hidden" id="token" name="token" value="${token}">
       <button type="submit" class="btn">Reset</button>
     </form>
     <div id="error-message" class="error-message"></div>
   </div>
 </div>
 
 <script>
   const form = document.getElementById('login-form');
   const errorMessage = document.getElementById('error-message');
 
   let failedAttempts = 0;
 
   form.addEventListener('submit', (event) => {
     event.preventDefault();
 
     const password = document.getElementById('password').value;
     const confirm_password = document.getElementById('confirm-password').value;
     const email = document.getElementById('email').value;
     const token = document.getElementById('token').value;
     const otp = document.getElementById('otp').value;
 
 
     const data = {
       password: password,
       confirm_password: confirm_password,
       email: email,
       token: token,
       otp: otp
     }
 
     fetch('${process.env.REACT_APP_BACKEND_URL}/resetpassword', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
     })
      .then(response => {
           if (response.status != 200) {
               return response.json()
           } else {
               alert("Thay đổi password thành công")
           }
       })
       .then(data => {
           errorMessage.textContent = data.message;
       })
   });
 </script>
 </body>
 </html>`
   return html
 }
  
 