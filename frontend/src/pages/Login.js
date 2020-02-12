import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Login.css';

import api from '../services/api';
import logo from '../assets/logo.svg';

function Login({ history }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleLogin(e){
        e.preventDefault();

        const response = await api.post('/login', { username: username, password: password });

        if (response.data._id) {

            const { _id } = response.data;
            history.push(`/home/${_id}`);

        } else setError(response.data.message);
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

                <div className="error">{error}</div>

                <button type="submit">Entrar</button>

                <p>Não possui conta? <Link to="/signup" className="signup-link"> Cadastre-se </Link></p>
            
            </form>
        </div>
    );
}

export default Login;