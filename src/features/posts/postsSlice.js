import {createSlice} from "@reduxjs/toolkit";

const initialState = [
    { id: '1', title: 'First Post!', content: 'Hello!' },
    { id: '2', title: 'Second Post', content: 'More text' }
];

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded(state, action) {
            // createSlice automatically generates an 'action creator' function with the same name! (posts/postAdded)
            state.push(action.payload); // Mutation allowed because inside createSlice() / uses Immer
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const existingPost = state.find(post => post.id === id);

            if (existingPost) {
                // mutation is fine in this case (see above)
                existingPost.title = title
                existingPost.content = content
            }
        }
    }
});

export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer
