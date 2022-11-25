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
        }
    }
});

export const { postAdded } = postsSlice.actions

export default postsSlice.reducer
