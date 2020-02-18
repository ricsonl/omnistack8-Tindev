import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Home.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

function Home({ match }) {
    const [users, setUsers] = useState([]);
    const [matchUser, setMatchUser] =useState(null);

    useEffect(() => {
        async function getUsers(){
            const response = await api.get('users', {
                headers: { logged: match.params.id }
            });

            setUsers(response.data);
        }
        getUsers();

    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', user => {
            setMatchUser(user);
        });
        
    }, [match.params.id]);

    async function handleLike(targetId){
        await api.post(`/users/${targetId}/like`, null, {
            headers: { logged: match.params.id },
        });

        setUsers(users.filter(user => user._id !== targetId));
    }

    async function handleDislike(targetId) {
        await api.post(`/users/${targetId}/dislike`, null, { 
            headers: { logged: match.params.id },
        });

        setUsers(users.filter(user => user._id !== targetId));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindi" />
            </Link>
                { users.length>0 ? (
                    <ul>
                        {users.map(user => (
                            <li key={user._id}>
                                <img src={`http://localhost:3333/files/${user.avatar}`} alt="" />
                                <footer>
                                    <strong>{user.name}</strong>
                                    <p>{user.bio}</p>
                                </footer>

                                <div className="buttons">
                                    <button type="button" onClick={() => handleDislike(user._id)}>
                                        <img src={dislike} alt="Dislike" />
                                    </button>
                                    <button type="button" onClick={() => handleLike(user._id)}>
                                        <img src={like} alt="Like" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="empty">Fim :/</div>
                ) }

                { matchUser && (
                    <div className="match-container">
                        <img src={itsamatch} alt="It's a match!" />
                        
                        <img className="avatar" src={`http://localhost:3333/files/${matchUser.avatar}`} alt=""/>
                        <strong>{matchUser.name}</strong>
                        <p>{matchUser.bio}</p>
                        
                        <button type="button" onClick={ () => setMatchUser(null) } >FECHAR</button>
                    </div>
                ) }
        </div>
    );
}

export default Home;