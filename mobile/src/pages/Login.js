import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import logo from '../assets/logo.png';

function Login(){
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
                placeholder="Nome de usuário"
                placeholderTextColor="#999" 
                style={styles.input}
            />

            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Senha"
                placeholderTextColor="#999" 
                style={styles.input}
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

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

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#df4723',
        borderRadius: 4,
        marginTop: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default Login;