const express = require("express");

const { authUser } = require("../middleware/auth");

const {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    bookmark,
    getBookmark,
    deleteBookmark,
    checkBookmark,
    getMyPost,
    follow,
    unfollow,
    uploadProfile,
    getUser,
    search,
    followercount,
    followingcount,
    checkfollowing,
    fetchfollowing,
    verifycode,
    sendToken,
    generateQR,
    loginAdmin,
    adminDashBoard,
    manageUser,
    getLoginPage,
    getRegisterPage,
    verifyTOTP,
    sendTokenResetPassword,
    getResetPasswordPage
} = require("../controllers/user")

const router = express.Router();

// API Admin
// route truy cập trang quản lí của admin
router.get('/admin', authUser, adminDashBoard)
// route truy cập trang đăng nhập của admin
router.get('/admin/login', getLoginPage)
// route xử lí yêu cầu đăng nhập
router.post('/admin/login', login)
// route lock và active cho một user
router.put('/admin/user', authUser, manageUser)


// API Register
// route trả về trang đăng kí khi click qua email
router.get('/account/accept', getRegisterPage)
// route yêu cầu tạo một mã QR xác thực 2 lớp
router.get('/generate-qr', generateQR)
// route trả về trang chứa mã QR để quét
router.get('/account/verify/:email', generateQR)
// route xử lí để xác nhận xác thực 2 bước
router.post('/account/verify', verifyTOTP)
// route gửi link đăng kí về mail
router.post('/sendmail', sendToken)
// route xử lí đăng kí tài khoản mật khẩu nhưng chưa có xác thực 2 lớp
router.post("/register", register);

// API Resetpassword
// route truy cập trang resetpassword
router.get('/account/reset', getResetPasswordPage)
// route gửi một link resetpassword về mail
router.post('/account/reset/:email', sendTokenResetPassword)
//router.post("/verifycode", verifycode);


// route login
router.post("/login", login);

// route logout
router.get("/logout", authUser, logout);

// route get user data
router.get("/user", authUser, getUser);

// route forgot password
//router.post("/forgotpassword/", sendTokenResetPassword)

// route reset password
router.post("/resetpassword", resetPassword)

// route add a post into bookmark
router.post("/bookmark", authUser, bookmark)

// route get all bookmarks of a user
router.get("/bookmark", authUser, getBookmark)

// route delete a post from bookmark
router.delete("/bookmark", authUser, deleteBookmark)

// route check post exist in bookmark
router.post("/checkbookmark", authUser, checkBookmark)

// route get all posts of a user
router.get("/post/user", authUser, getMyPost)

// route follow a user
router.post("/follow", authUser, follow)

// route unfollow a user
router.post("/unfollow", authUser, unfollow)

// route upload profile user
router.post("/profile", authUser, uploadProfile)

// route search
router.get("/search", search);

router.post("/countfollower", authUser, followercount);
router.post("/countfollowing", authUser, followingcount);

router.post("/checkfollow", authUser, checkfollowing);

router.post("/fetchfollowing", authUser, fetchfollowing);

module.exports = router;