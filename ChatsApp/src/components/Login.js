import axios from 'axios';
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Context from "../shared/Context";



export default function Login({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUserDetails } = useContext(Context);
    const handleLogin = () => {
        let req={
            username:username,
            password:password

        }
        axios.post("http://192.168.2.94:5000/auth/login",req).then((response)=>{
          setUserDetails({authToken: response.data.token})
        })
        
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            
            <Text>Have an account? <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <Text style={styles.hyperlink}>Signup</Text>
            </TouchableOpacity>
            </Text>
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
