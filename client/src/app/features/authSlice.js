import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    token: null,
    user: null,
    loading: true
}

const storedAuth = localStorage.getItem('auth');
if (storedAuth) {
    const { token, user } = JSON.parse(storedAuth);
    initialState.token = token;
    initialState.user = user;
}


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action)=>{
            state.token = action.payload.token
            state.user = action.payload.user
            localStorage.setItem('auth', JSON.stringify(action.payload))
    },
    logout: (state)=>{
        state.token = '';
        state.user = null;
        localStorage.removeItem('auth')    
    },
    setLoading: (state, action)=>{
        state.loading = action.payload
    }
}
})

export const {login, logout, setLoading} = authSlice.actions

export default authSlice.reducer