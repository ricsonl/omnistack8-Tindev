import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

import logo from '../assets/logo.svg';

function Login({ history }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e){
        e.preventDefault();

        const userExists = api.post('/login', { username: username, password: password });

        console.log(userExists);

        if (userExists) {
            const { _id } = userExists;
            history.push(`/home/${_id}`);
        }

        else history.push('/');
    }
      
    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <img src={logo} alt="Tindi" />

                <input type="text"
                       placeholder="Nome de usuário" 
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                />
                <input type="password"
                       placeholder="Senha" 
                       value={password}
                       onChange={e => setPassword(e.target.value)}
                />

                <button type="submit">Enviar</button>
            </form>
        </div>
);
}

export default Login;