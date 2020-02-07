import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

import logo from '../assets/logo.svg';

function Login({ history }) {
    const [username, setUsername] = useState('');

    function handleChange(e){ 
        setUsername(e.target.value);
    }

    async function handleSubmit(e){
        e.preventDefault();

        const response = await api.post('/users', {
            username,
        });

        const { _id } = response.data;

        history.push(`/home/${_id}`);
    }
      
    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindi" />
                <input placeholder="Digite seu usuário no Github" 
                       value={username}
                       onChange={handleChange}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
);
}

export default Login;