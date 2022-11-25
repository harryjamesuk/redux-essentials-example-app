import {useSelector} from "react-redux";

export default function SinglePostPage({match}) {
    const { postId } = match.params

    // Note: The component will re-render any time the value returned from useSelector changes to a new reference.
    const post = useSelector(state =>
        state.posts.find(post => post.id === postId)
    );

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
                    <p className='post-content'>{post.content}</p>
                </article>
            </section>
        );
    }
}
