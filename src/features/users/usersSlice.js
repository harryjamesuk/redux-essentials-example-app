import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {client} from "../../api/client";

const initialState = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async() => {
    const response = await client.get('/fakeApi/users');
    return response.data; // response object looks like {data: []}
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                /* Immer allows us to update state in two ways; either mutating the existing state
                value, or returning a new result.

                You should do this instead of 'state = action.payload' - this will NOT WORK.
                That's because it points the local 'state' variable to a different reference which
                is then ignored.
                 */
                return action.payload;
            });
    }
});

export default usersSlice.reducer;
