import React, { useState } from 'react';
import { register as apiRegister } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({});
    const nav = useNavigate();

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();
        await apiRegister(form);
        nav('/login');
    };

    return (
        <form onSubmit={onSubmit} className="max-w-md mx-auto p-4">
            <h1 className="text-2xl mb-4">회원가입</h1>
            {['username','password','email','nickname'].map(field=>(
                <input key={field}
                       name={field}
                       className="w-full mb-2 p-2 border"
                       placeholder={field}
                       type={field==='password'?'password':'text'}
                       onChange={onChange}
                />
            ))}
            <button className="w-full bg-green-500 text-white p-2">가입하기</button>
        </form>
    );
}