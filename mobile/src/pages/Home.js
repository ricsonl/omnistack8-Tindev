import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { Image, Text, View, SafeAreaView, StyleSheet, TouchableOpacity, Animated, PanResponder, Dimensions } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

function Login({ navigation }) {
    const { height, width } = Dimensions.get('screen');

    const [users, setUsers] = useState([]);
    const [matchUser, setMatchUser] = useState(null);

    const position = useRef(new Animated.ValueXY()).current;

    const rot = useRef(position.x.interpolate({
        inputRange: [-width/2, 0, width/2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp',
    })).current;

    const rotateAndTranslate = useRef({
        transform: [{
            rotate: rot,
        },
        ...position.getTranslateTransform()
        ]
    }).current;

    const likeOpacity = useRef(position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [0, 0, 0.8],
        extrapolate: 'clamp',
    })).current;

    const nopeOpacity = useRef(position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [0.8, 0, 0],
        extrapolate: 'clamp',
    })).current;

    const nextCardOpacity = useRef(position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [1, 0.2, 1],
        extrapolate: 'clamp',
    })).current;

    const nextCardScale = useRef(position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [1, 0.85, 1],
        extrapolate: 'clamp',
    })).current;

    const panResponder = React.useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
            position.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: (evt, gestureState) => {
            if(gestureState.dx > 125){
                
                Animated.spring(position, {
                    toValue: { x: width + 100, y: gestureState.dy}
                }).start(() => handleLike());

            } else if (gestureState.dx < -125) {
    
                Animated.spring(position, {
                    toValue: { x: -width - 100, y: gestureState.dy }
                }).start(() => handleDislike());

            } else {

                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    friction: 4
                }).start();

            }
        },
    }), [users[0]]);

    useEffect(() => {
        position.setValue({ x: 0, y: 0 })
    }, [users[0]])

    const id = navigation.getParam('user');

    useEffect(() => {
        AsyncStorage.getItem('user').then(id => {
            if (id) {
                navigation.setParams({user: id});
            }
        })
    }, []);

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/users', {
                headers: { logged: id, }
            });
            setUsers(response.data);
        }
        loadUsers();

    }, [id]);

    useEffect(() => {
        const socket = io('http://192.168.0.18:3333', {
            query: { user: id }
        });

        socket.on('match', user => {
            setMatchUser(user);
        });

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
                    <Text style={styles.empty}>Cabou :(</Text>
                ) : (
                    users.map((user, index) => (
                        (index === 0) ? (
                            <Animated.View
                                {...panResponder.panHandlers}
                                key={user._id}
                                style={[
                                    rotateAndTranslate,
                                    styles.card,
                                    { zIndex: users.length - index }
                                ]}
                            >
                                <Animated.View style={[styles.likeStamp, { zIndex: users.length, opacity: likeOpacity }]}>
                                    <Text style={styles.likeStampText}>LIKE</Text>
                                </Animated.View>

                                <Animated.View style={[styles.nopeStamp, { zIndex: users.length, opacity: nopeOpacity }]}>
                                    <Text style={styles.nopeStampText}>NOPE</Text>
                                </Animated.View>

                                <Image source={{ uri: `http://192.168.0.18:3333/files/${user.avatar}` }} style={styles.avatar} />
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                                </View>

                            </Animated.View>
                        ) : ( index===1 ? (
                            <Animated.View
                                key={user._id}
                                style={[
                                    styles.card,
                                    { 
                                        zIndex: users.length - index,
                                        opacity: nextCardOpacity,
                                        transform: [{scale: nextCardScale}]
                                    }
                                ]}
                            >
                                <Image source={{ uri: `http://192.168.0.18:3333/files/${user.avatar}` }} style={styles.avatar} />
                                <View style={styles.footer}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                                </View>

                            </Animated.View>
                        ) : null )
                    ))
                )}
            </View>

            { users.length > 0 ? (
                <View style={[styles.buttonsContainer, { zIndex: -1 }]}>
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

            { matchUser && (
                <View style={[styles.matchContainer, { zIndex: users.length + 1 }]}>
                    <Image source={itsamatch} style={styles.itsamatch} />

                    <Image source={{ uri: `http://192.168.0.18:3333/files/${matchUser.avatar}` }} style={styles.matchAvatar}  />
                    <Text style={styles.matchName}>{matchUser.name}</Text>
                    <Text numberOfLines={3} style={styles.matchBio}>{matchUser.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchUser(null)} >
                        <Text style={styles.matchCloseText}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            ) }

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

    likeStamp: {
        width: 110,
        position: 'absolute',
        top: 40,
        left: 35,
        transform: [{rotate: '-30deg'}],
    },

    nopeStamp: {
        width: 110,
        position: 'absolute',
        top: 40,
        right: 35,
        transform: [{ rotate: '30deg' }],
    },

    likeStampText: {
        paddingHorizontal: 0,
        borderWidth: 4,
        borderRadius: 6,
        borderColor: '#5c7',
        color: '#5c7',
        fontSize: 32,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },

    nopeStampText: {
        paddingHorizontal: 0,
        borderWidth: 4,
        borderRadius: 6,
        borderColor: '#d22',
        color: '#d22',
        fontSize: 32,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
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

    itsamatch: {
        height: 60,
        resizeMode: 'contain',
    },

    matchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        marginVertical: 30,
        borderWidth: 5,
        borderColor: '#fff',
    },

    matchName: {
        fontWeight: 'bold',
        fontSize: 26,
        color: '#fff',
    },

    matchBio: {
        marginTop: 10,
        paddingHorizontal: 30,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        maxWidth: 400,
        color: 'rgba(255, 255, 255, 0.8)',
    },

    matchCloseText: {
        marginTop: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
    },
});

export default Login;