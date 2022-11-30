import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import {selectAllPostsById} from "./postsSlice";

export default function SinglePostPage({match}) {
    const { postId } = match.params

    // Note: The component will re-render any time the value returned from useSelector changes to a new reference.
    const post = useSelector(state => selectAllPostsById(state, postId));

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        );
    } else {
        return (
            <section>
                <article className='post'>
                    <h2>{post.title}</h2>
                    <TimeAgo timestamp={post.date}/>
                    <p className='post-content'>{post.content}</p>
                    <PostAuthor userId={post.user}/>
                    <ReactionButtons post={post} />
                    <Link to={`/editPost/${postId}`} className='button'>Edit Post</Link>
                </article>
            </section>
        );
    }
}
