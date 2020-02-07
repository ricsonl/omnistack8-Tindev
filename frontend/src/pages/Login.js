import React, { useState } from 'react';
import './Login.css';

import logo from '../assets/logo.svg';

function Login() {
    return (
        <div class="login-container">
            <form>
                <img src={logo} alt="Tindi" />
                <input placeholder="Digite seu usuário no Github" />
                <button type="submit">Enviar</button>
            </form>
        </div>
);
}

export default Login;