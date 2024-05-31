const Post = require("../models/Post");
const User = require("../models/User");

// Tạo một bài post
exports.newPost = async (req, res) => {
  try {
    const blog = req.body
    blog.user = req.user.id
    const newPost = await new Post(blog).save();
    const data = await User.findById(req.user.id)
    await newPost.populate("user", "name picture");
    data.posts.push(newPost._id)
    data.save();
    res.json(newPost);
  } catch (error) {
    // console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

// Tạo một bình luận trên một bài post
exports.postComment = async (req, res) => {
    try {
      const { name,
        image,
        content,
        id2 } = req.body;
      const id1 = req.user.id
      const user = await Post.findOne({ _id: id2 });
      if (user.status === 'lock') {
        return res.status(403).json("permission denied")
      }
      const date = new Date();
  
      var ndata = {
        comment: content,
        image: image,
        commentBy: id1,
        commentAt: date,
        name: name
      }
      var datas = user.comments;
      datas.push(ndata)
      user.comments = datas;
      user.save();
      res.status(201).json({ msg: "ok" });
    } catch (error) {
      // console.log(error)
      res.status(401).json({ msg: "An Error Occurred" })
    }
}

// Lấy thông tin các bài post để hiển thị trang home
exports.getPosts = async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
  
      const skip = (page - 1) * size;
  
      var total = await Post.countDocuments();
      const posts_data = await Post.find().skip(skip).limit(size);
      await Promise.all(
        posts_data.map((post) => post.populate("user", "name picture about"))
      );
  
      // lọc ra cái bài post của tài khoản bị khóa
      var posts = []
      for (var i=0; i<posts_data.length; i++) {
        if (posts_data[i].status != 'lock') {
          posts.push(posts_data[i])
        }
      }

      total = posts.length
      res.status(201).send({
        posts,
        total,
        page,
        size,
      });
    } catch (error) {
      // console.log(error);
      res.status(400).json(error);
    }
};

// lấy thông tin của một bài post
exports.getPostData = async (req, res) => {
    try {
      const { id } = req.params;
      var data = await Post.findById(id);
      // console.log(data.user);
      //const datau = await User.findById(data.user)
      await data.populate("user", "name picture about")
      if (data.status === 'lock') {
        res.status(403).json({msg: "post is blocked"})
      }
  
      return res.status(200).json({ msg: data})
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "error" });
    }
}

// lấy thông tin tất cả comment của một bài post
exports.getComment = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await Post.findOne({ _id: id });
      const user = data.comments

      // Bỏ đi những comment của user bị lock
      var users = []
      for (var i=0; i<user.length; i++) {
        const u = await User.findOne({_id: user[i].commentBy})
        if(u.status != 'lock') {
          users.push(user[i])
        }
      }
      res.status(201).json(users);
    } catch (error) {
      console.log(error)
      res.status(400).json({ msg: "error" })
    }
}

// Xóa một bài post
exports.deletePost = async (req, res) => {
    try {
      const { postid } = req.query;
      const id = req.user.id;

      const user_admin = await User.findOne({_id: id})
      const post = await Post.findOne({_id: postid})
      if (!post) {
        return res.status(400).json({msg: "post not found"})
      }
      if ((post.user != id) && !user_admin.isAdmin) {
        return res.status(403).json({msg: "permission denied"})
      }

      if (post.status === 'lock') {
        return res.status(403).json({msg: "post is blocked"})
      }

      await Post.deleteOne({_id: postid});
      var datas = await User.findById(post.user);
      arr = datas.posts;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == postid) {
          arr.splice(i, 1);
        }
      }
      datas.posts = arr;
      datas.save();
      return res.status(200).json({ mgs: "ok" });
    } catch (error) {
      console.log(error);
      console.log("error in deleting post");
      return res.status(400).json({ mgs: "Error" });
    }
  }