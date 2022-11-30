import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {postUpdated, selectAllPostsById} from "./postsSlice";
import {nanoid} from "@reduxjs/toolkit";
import {useHistory} from "react-router-dom/cjs/react-router-dom";

export default function EditPostForm({match}) {
    const { postId } = match.params;
    const post = useSelector(state => selectAllPostsById(state, postId));
    const users = useSelector(state => state.users);

    const [title, setTitle] = React.useState(post.title);
    const [content, setContent] = React.useState(post.content);
    const [author, setAuthor] = React.useState(post.user);

    const dispatch = useDispatch();
    const history = useHistory();

    const onTitleChanged = e => setTitle(e.target.value);
    const onAuthorChanged = e => setAuthor(e.target.value);
    const onContentChanged = e => setContent(e.target.value);

    const onSavePostClicked = () => {
        if (title && content) {
            dispatch(
                postUpdated({
                    id: nanoid(),
                    title,
                    content
                })
            );
            history.push(`/posts/${postId}`);
        }
    };

    const userOptions = users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ));

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor='postTitle'>Post Title:</label>
                <input
                    type='text'
                    id='postTitle'
                    name='postTitle'
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor='postAuthor'>Author:</label>
                <select value={author} onChange={onAuthorChanged}>
                    <option value=''></option>
                    {userOptions}
                </select>
                <label htmlFor='postContent'>Content:</label>
                <textarea
                    id='postContent'
                    name='postContent'
                    value={content}
                    onChange={onContentChanged}
                />
                <button type='button' onClick={onSavePostClicked}>Save Post</button>
            </form>
        </section>
    );
}
