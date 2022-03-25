import * as mongoose from 'mongoose'
import Post from './post.interface'

const postSchema = new mongoose.Schema({
    author:{
        type: String,
    },
    content: {
        type: String,

    },
    title: {
        type: String
    }
})

const postModel = mongoose.model<Post & mongoose.Document>('Post',postSchema)

export default postModel