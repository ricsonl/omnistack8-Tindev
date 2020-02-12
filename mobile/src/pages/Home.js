import React from 'react';
import { Image } from 'react-native';

import logo from '../assets/logo.png';

function Login({ navigation }) {

    return (
            <Image source={logo} style={styles.logo} />
    );
}

export default Login;