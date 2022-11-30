import TimeAgo from "./TimeAgo";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import {Link} from "react-router-dom";

export default function PostExcerpt({post}) {
    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <TimeAgo timestamp={post.date}/>
            <p className="post-content">{post.content.substring(0, 100)}</p>
            <PostAuthor userId={post.user}/>
            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className='button muted-button'>
                View Post
            </Link>
        </article>
    );
}
