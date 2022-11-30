import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {client} from "../../api/client";

const initialState = {
    posts: [],
    status: 'idle',
    error: null
};

/* First parameter is used as the prefix for the generation action types.
* Second parameter is the "payload creator" that returns a Promise.
* You can either return the Promise directly, or extract some data from the API
* response and return that.
*
* Note that our thunk is created OUTSIDE the slice, therefore we must use
* extraReducer's to handle reducer cases. */
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async() => {
    const response = await client.get('/fakeApi/posts');
    return response.data; // response object looks like {data: []}
});

export const addNewPost = createAsyncThunk('posts/addNewPost',
    async (initialPost) => {
        const response = await client.post('/fakeApi/posts', initialPost); // Send our initial post data.
        return response.data; // Return server's complete post object, including unique ID.
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
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
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                /* Add any fetched posts to the array. Concat doesn't mutate, but we can still mutate here
                while using Immer. */
                state.posts = state.posts.concat(action.payload);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload); // Directly add new post object (mutation is fine because of Immer!)
            })
    }
});

export const selectAllPosts = state => state.posts.posts;
export const selectAllPostsById = (state, postId) =>
    selectAllPosts(state).find(post => post.id === postId);

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
