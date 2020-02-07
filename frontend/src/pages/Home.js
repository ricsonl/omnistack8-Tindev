import React from 'react';
import './Home.css';

import logo from '../assets/logo.svg';

function Home({ match }) {
    return (
        <div className="main-container">
            <img src={logo} alt="Tindi" />
            <ul>
                <li>
                    <img src="https://avatars1.githubusercontent.com/u/54897065?v=4" alt=""/>
                </li>
            </ul>
        </div>
    );
}

export default Home;