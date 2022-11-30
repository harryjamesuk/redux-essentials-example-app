import {createSlice, nanoid} from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    status: 'idle',
    error: null
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId,
                        reactions: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            eyes: 0
                        }
                    }
                }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = selectAllPostsById(state, id);

            if (existingPost) {
                // mutation is fine in this case (see above)
                existingPost.title = title
                existingPost.content = content
            }
        },
        reactionAdded(state, action) {
            const { id, reaction } = action.payload;
            const existingPost = selectAllPostsById(state, id);

            if (existingPost) {
                existingPost.reactions[reaction]++;
            }
        }
    }
});

export const selectAllPosts = state => state.posts.posts;
export const selectAllPostsById = (state, postId) =>
    selectAllPosts(state).find(post => post.id === postId);

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
