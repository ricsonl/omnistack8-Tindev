import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Image, Text, View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';

function Login({ navigation }) {

    const [users, setUsers] = useState([]);

    const id = navigation.getParam('user');

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/users', {
                headers: { logged: id, }
            })
            setUsers(response.data);
        }
        loadUsers();

    }, [id]);

    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/users/${user._id}/like`, null, {
            headers: { logged: id },
        });

        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;


        await api.post(`/users/${user._id}/dislike`, null, {
            headers: { logged: id },
        });

        setUsers(rest);
    }

    async function handleLogout(){
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={logo} style={styles.logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                { users.length === 0 ? (
                    <Text style={styles.empty}>Acabou :(</Text>
                ) : (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, { zIndex: users.length - index }]}>
                            <Image source={{ uri: `http://192.168.0.18:3333/files/${user.avatar}` }} style={styles.avatar} />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                ) }
            </View>

            { users.length > 0 ? (
                <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleDislike} style={styles.button}>
                    <Image source={dislike}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLike} style={styles.button}>
                    <Image source={like}></Image>
                </TouchableOpacity>
            </View>
            ) : (
                <View />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        marginTop: 30,
    },
    
    empty: {
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#999',
    },

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18,
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        elevation: 2,
    },
});

export default Login;