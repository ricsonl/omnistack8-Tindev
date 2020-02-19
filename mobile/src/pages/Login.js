import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, KeyboardAvoidingView, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';

function Login({ navigation }){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('user').then(id => {
            if (id) {
                navigation.navigate('Home', { id });
            }
        })
    }, []);

    async function handleLogin(){
        const response = await api.post('/login', { username: username, password: password });

        if (response.data._id) {

            const { _id } = response.data;
            await AsyncStorage.setItem('user', _id);
            navigation.navigate('Home', { user: _id });

        } else setError(response.data.message);
    }

    return (
        <KeyboardAvoidingView
            behavior="padding" 
            style={styles.container}
            enabled={Platform.OS === 'ios'}
        >

            <Image source={logo} style={styles.logo}/>

            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Username"
                placeholderTextColor="#999" 
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />

            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="password"
                secureTextEntry={true}
                placeholder="Password"
                placeholderTextColor="#999" 
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            { error!= '' && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signup}>

                <Text style={styles.signupText}>Don't have an account?</Text>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupButton}>
                    <Text style={styles.signupButtonText}> Register</Text>
                </TouchableOpacity>
                
            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    logo: {
        marginBottom: 20,
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginBottom: 7,
        paddingHorizontal: 15,
    },

    error: {
        backgroundColor: 'rgba(255,0,55,0.5)',
        borderRadius: 4,
        alignSelf: 'stretch',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 15,
        paddingVertical: 4,
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#df4723',
        borderRadius: 4,
        marginTop: 7,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    signup: {
        flexDirection: 'row',
        marginTop: 14,
    },

    signupText: {
        fontSize: 15,
        color: '#999',
    },

    signupButton: {
        backgroundColor: 'transparent',
    },

    signupButtonText: {
        fontSize: 15,
        color: '#df4723',
    },
});

export default Login;