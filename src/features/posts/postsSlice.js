import {createAsyncThunk, createSlice, nanoid} from "@reduxjs/toolkit";
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
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Add any fetched posts to the array
                state.posts = state.posts.concat(action.payload); // concat does not mutate!
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export const selectAllPosts = state => state.posts.posts;
export const selectAllPostsById = (state, postId) =>
    selectAllPosts(state).find(post => post.id === postId);

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
