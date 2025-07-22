import React, { useState } from 'react';
import { register as apiRegister } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ username: '', password: '', email: '', nickname: '' });
    const [usernameStatus, setUsernameStatus] = useState({ checked: false, message: '' });
    const [nicknameStatus, setNicknameStatus] = useState({ checked: false, message: '' });
    const nav = useNavigate();

    const onChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // 입력값이 변경되면 중복 확인 상태 초기화
        if (e.target.name === 'username') {
            setUsernameStatus({ checked: false, message: '' });
        }
        if (e.target.name === 'nickname') { // email -> nickname
            setNicknameStatus({ checked: false, message: '' });
        }
    };

    const checkUsername = async () => {
        if (!form.username) {
            setUsernameStatus({ checked: false, message: '아이디를 입력해주세요.' });
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/user/check-username?username=${form.username}`);
            const message = await response.text();

            if (response.ok) {
                setUsernameStatus({ checked: true, message });
            } else {
                setUsernameStatus({ checked: false, message });
            }
        } catch (error) {
            setUsernameStatus({ checked: false, message: "오류가 발생했습니다." });
        }
    };

    const checkNickname = async () => {
        if (!form.nickname) {
            setNicknameStatus({ checked: false, message: '닉네임을 입력해주세요.' });
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/user/check-nickname?nickname=${form.nickname}`);
            const message = await response.text();

            if (response.ok) {
                setNicknameStatus({ checked: true, message });
            } else {
                setNicknameStatus({ checked: false, message });
            }
        } catch (error) {
            setNicknameStatus({ checked: false, message: '오류가 발생했습니다.' });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (!usernameStatus.checked || !nicknameStatus.checked) {
            alert('아이디와 닉네임 중복 확인을 완료해야 합니다.');
            return;
        }
        await apiRegister(form);
        nav('/login');
    };

    return (
        <form onSubmit={onSubmit} className="max-w-md mx-auto p-4">
            <h1 className="text-2xl mb-4">회원가입</h1>

            {/* 아이디 입력 필드 */}
            <div className="flex flex-col mb-2"> {/* flex-col 추가 */}
                <div className="flex"> {/* input과 button을 감싸는 div 추가 */}
                    <input name="username" className="w-full p-2 border" placeholder="username" onChange={onChange} />
                    <button type="button" onClick={checkUsername} className="w-32 ml-2 bg-gray-500 text-white p-2">중복 확인</button>
                </div>
                {usernameStatus.message && <p className={usernameStatus.checked ? 'text-green-500' : 'text-red-500'}>{usernameStatus.message}</p>}
            </div>

            {/* 닉네임 입력 필드 */}
            <div className="flex flex-col my-4"> {/* flex-col 추가 */}
                <div className="flex"> {/* input과 button을 감싸는 div 추가 */}
                    <input name="nickname" className="w-full p-2 border" placeholder="nickname" onChange={onChange} />
                    <button type="button" onClick={checkNickname} className="w-32 ml-2 bg-gray-500 text-white p-2">중복 확인</button>
                </div>
                {nicknameStatus.message && <p className={nicknameStatus.checked ? 'text-green-500' : 'text-red-500'}>{nicknameStatus.message}</p>}
            </div>

            {/* 나머지 필드 (비밀번호, 이메일) */}
            <input name="password" className="w-full mb-2 p-2 border" placeholder="password" type="password" onChange={onChange} />
            <input name="email" className="w-full mb-4 p-2 border" placeholder="email" type="email" onChange={onChange} />

            <button type="submit" disabled={!usernameStatus.checked || !nicknameStatus.checked} className="w-full bg-green-500 text-white p-2 disabled:bg-gray-300">
                가입하기
            </button>
        </form>
    );
}