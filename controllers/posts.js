import Post from "../models/Post.js";
import User from "../models/User.js";

//create..
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {}, // if there are user present.. the like would update..{ userId: true}
            comments: [],
        });
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post); // sending all the posts with updated post
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

//read..
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({createdAt: -1});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }); //individual user posts created for user feed
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//update..
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id); //grabbing post info
        const isLiked = post.likes.get(userId); //grabbing info about user whether he liked or not

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes }, //passing the updates likes
            { new: true}
        )

        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};
