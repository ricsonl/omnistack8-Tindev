import React, { useState } from 'react';
import './Signup.css';

import api from '../services/api';

import logo from '../assets/logo.svg';

function Signup({ history }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null);

    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const data = new FormData();

        data.append('username', username);
        data.append('password', password);
        data.append('name', name);
        data.append('bio', bio);
        data.append('avatar', avatar);

        const response = await api.post('/users', data);

        if(response.data._id){

            const { _id } = response.data;
            history.push(`/home/${_id}`);

        } else setError(response.data.message);
    }

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit}>
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

                <input type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input type="text"
                    placeholder="Bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                />

                <p>Escolha uma foto de perfil</p>

                <input type="file" onChange={e => setAvatar(e.target.files[0])} />

                <div className="error">{error}</div>
            
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default Signup;