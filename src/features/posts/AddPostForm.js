import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {addNewPost} from "./postsSlice";

export default function AddPostForm() {
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [addRequestStatus, setAddRequestStatus] = React.useState('idle');

    const users = useSelector(state => state.users);

    const dispatch = useDispatch();

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);
    const onAuthorChanged = e => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

    const onSavePostClicked = async() => {
        if (canSave) {
            try {
                /* We can setAddRequestStatus() here instead, which means we don't need to rely on external state.
                This means we don't need a useEffect() hook.
                 */
                setAddRequestStatus('pending');
                /*
                createAsyncThunk handles errors internally and returns the final action it dispatched; either
                fulfilled or rejected.
                If we want to look at the success of failure from this scope, we must use .unwrap() from
                Redux Toolkit, which will return a new Promise that has either the action.payload, or throws
                an error if it's the rejected action, allowing us to use normal try/catch logic.
                 */
                await dispatch(addNewPost({ title, content, user: userId })).unwrap();

                setTitle('');
                setContent('');
                setUserId('');
            } catch (e) {
                console.error('Failed to save the post: ', e);
            } finally {
                setAddRequestStatus('idle'); // only checking if in progress or not.
            }
        }
    };

    const userOptions = users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ));

    return (
        <section>
            <h2>Add a New Post</h2>
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
                <select onChange={onAuthorChanged}>
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
                <button type='button' onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
            </form>
        </section>
    );
}
