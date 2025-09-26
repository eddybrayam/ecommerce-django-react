import api from './api';

export async function login(email,password){
    const res = await api.post('auth/login/',{ username: email,password });
    const{ access, refresh } = res.data;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken',refresh);
    api.defaults.headers.common['Authorization'] = 'Bearer ${access}';
    return res.data;
}
export function logout(){
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
}
export async function getUser(){
    return api.get('auth/user/');
}
