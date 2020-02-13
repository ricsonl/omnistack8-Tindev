import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Image, TextInput, TouchableOpacity, Text} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import api from '../services/api';

import logo from '../assets/logo.png';

function Signup({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null);

    const [preview, setPreview] = useState(null);

    const [error, setError] = useState('');

    function handleSelectImage(){
        ImagePicker.showImagePicker({
            title: 'Selecionar imagem',
        }, upload => {
            if (upload.error) {
                console.log('Error');
            } else if (upload.didCancel) {
                console.log('User canceled');
            } else {
                const preview_ = {
                    uri: `data:image/jpeg;base64,${upload.data}`,
                }

                let prefix;
                let ext;

                if (upload.fileName) {
                    [prefix, ext] = upload.fileName.split('.');
                    ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
                } else {
                    prefix = new Date().getTime();
                    ext = 'jpg';
                }
                
                let rot = 0;

                const image_ = {
                    uri: upload.uri,
                    type: upload.type,
                    name: `${prefix}.${ext}`,
                };
                
                setAvatar(image_);
                setPreview(preview_);
            }
        });
    }

    async function handleSubmit() {
        const data = new FormData();

        data.append('username', username);
        data.append('password', password);
        data.append('name', name);
        data.append('bio', bio);
        data.append('avatar', avatar);

        const response = await api.post('/users', data);

        if (response.data._id) {
            
            const { _id } = response.data;
            navigation.navigate('Home', { user:_id });

        } else setError(response.data.message);
    }


    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
            enabled={Platform.OS === 'ios'}
        >

            <Image source={logo} style={styles.logo} />

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Nome de usuário"
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
                placeholder="Senha"
                placeholderTextColor="#999"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Nome"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                autoCapitalize="none"
                placeholder="Bio"
                placeholderTextColor="#999"
                style={styles.inputBio}
                value={bio}
                onChangeText={setBio}
            />

            <TouchableOpacity style={styles.imageSelectButton} onPress={handleSelectImage}>
                <Text style={styles.imageSelectButtonText}> Escolha uma foto de perfil </Text>
            </TouchableOpacity>

            {preview && <Image style={styles.preview} source={preview} />}

            {error != '' && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Cadastrar</Text>
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

    inputBio: {
        height: 105,
        alignSelf: 'stretch',
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginBottom: 7,
        paddingHorizontal: 15,
    },

    imageSelectButton: {
        alignSelf: 'stretch',
        marginBottom: 15,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#aaa',
        borderStyle: 'dashed',
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageSelectButtonText: {
        fontSize: 14,
        color: '#888',
    },

    preview: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        borderRadius: 4,
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

    submitButton: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#df4723',
        borderRadius: 4,
        marginTop: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

});

export default Signup;