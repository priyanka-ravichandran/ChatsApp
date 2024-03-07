import React, { useState } from 'react';
import axios from 'axios';

import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';

export default function Signup({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
       
        let req={
            username:username,
            password:password

        }
        axios.post("http://192.168.2.94:5000/auth/signup",req).then((response)=>{
          console.log(response);
          navigation.navigate('login');
        })
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Signup</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text style={styles.hyperlink}>Go Back</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'rgba(90, 130, 225, 0.82)',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        width: '90%', // Increased width
        color: 'black',
    },
    button: {
        backgroundColor: 'rgba(90, 130, 225, 0.82)',
        padding: 10,
        width: '90%', // Increased width
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    hyperlink: {
        color: 'blue',
        textDecorationLine: 'underline',
    }
});
