import {useDispatch, useSelector} from "react-redux";
import {fetchPosts, selectAllPosts} from "./postsSlice";
import {useEffect} from "react";
import PostExcerpt from "./PostExcerpt";
import {Spinner} from "../../components/Spinner";

export default function PostsList() {
    const dispatch = useDispatch();

    const posts = useSelector(selectAllPosts);
    const postStatus = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;
    if (postStatus === 'loading') {
        content = <Spinner text='Loading...' />
    } else if (postStatus === 'succeeded') {
        /* Sort posts in reverse chronological order by datetime string
        We must use .slice() to generate a copy, so we don't cause a direct mutation: */
        const orderedPosts = posts.slice().sort((a, b) =>
            b.date.localeCompare(a.date)
        );

        content = orderedPosts.map(post => <PostExcerpt post={post}/>);
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    );
};
