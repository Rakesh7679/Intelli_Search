import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function register({username,email,password}){
    const response = await api.post("/api/auth/register",{username,email,password})
    return response.data
}

export async function login({email,password}){
    const response = await api.post("/api/auth/login",{email,password})
    if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data
}

export async function getMe(){
    const response = await api.get("/api/auth/get-me", {
        headers: getAuthHeaders(),
    })
    return response.data
}
