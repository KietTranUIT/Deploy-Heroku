const express = require("express");
const { authUser } = require("../middleware/auth");

const {newPost, postComment, getPosts, getPostData, getComment, deletePost} = require("../controllers/post");

const router = express.Router();

// route create a post
router.post("/post", authUser, newPost);

// route get all posts
router.get("/posts", getPosts);

// route get a post data
router.get("/post/:id", getPostData)

// route get all comments of a post
router.get("/comment/:id", authUser, getComment)

// route comment a post
router.post("/postcomment", authUser, postComment);

// route delete a post
router.delete("/post", authUser, deletePost)

module.exports = router;
