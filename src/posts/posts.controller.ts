import * as express from "express";
import Post from "./post.interface";
import postModel from "./post.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";

class PostsController {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getSinglePostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.updatePost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      
      .post(
        this.path,
        authMiddleware,
        validationMiddleware(CreatePostDto),
        this.createPost
      );
  }

  private getAllPosts = async (req: express.Request, res: express.Response) => {
    const posts = await this.post.find({});

    res.send(posts);
  };

  private createPost = async (req: RequestWithUser, res: express.Response) => {
    const postData: CreatePostDto = req.body;
    const createdPost = new this.post({
      ...postData,
      author: req.user._id,
    });
    const savedPost = await createdPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: savedPost,
    });
  };

  private getSinglePostById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const post = await this.post.findById(id);
    if (post) {
      res.status(200).json({
        success: true,
        data: post,
      });
    } else {
      next(new PostNotFoundException(id));
    }
  };

  private updatePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;

    const dataToBeUpdated: Post = req.body;

    const updatedPost = await this.post.findByIdAndUpdate(id, dataToBeUpdated, {
      new: true,
      runValidators: true,
    })

    if (!updatedPost) {
      next(new PostNotFoundException(id));
    }

    return res.status(200).json({
      success: true,
      data: updatedPost,
    });
  };

  private deletePost = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const id = req.params.id;
    const post = await this.post.findById(id);

    if (!post) {
      next(new PostNotFoundException(id));
    }

    await post.remove();

    res.status(200).json({
      success: true,
      message: `Post has been successfully deleted`,
      data: {},
    });
  };
}

export default PostsController;
