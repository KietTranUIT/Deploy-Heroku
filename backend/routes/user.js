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
    sendOTP
} = require("../controllers/user")

const router = express.Router();

router.post('/sendmail', sendOTP)

router.post("/verifycode", verifycode);

// route register
router.post("/register", register);

// route login
router.post("/login", login);

// route logout
router.get("/logout", authUser, logout);

// route get user data
router.get("/user", authUser, getUser);

// route forgot password
router.post("/forgotpassword", forgotPassword)

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