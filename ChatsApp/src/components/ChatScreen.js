import React, { useState, useEffect, useContext } from 'react';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Modal, TouchableOpacity} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Context from "../shared/Context";

import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Image } from 'react-native';
import socketIOClient from 'socket.io-client'

const ENDPOINT = "http://192.168.2.94:5000";
const ChatScreen = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const { userDetails } = useContext(Context);
    const { _id, username } = route.params.item;
    const [socket, setSocket] = useState(null);
    const [isImageViewVisible, setImageViewVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);



    useEffect(() => {
        const newSocket = socketIOClient(ENDPOINT, {
            transports: ['websocket'], // Use WebSocket transport
        });
        setSocket(newSocket);

        newSocket.on('receiveMessage', (newMessage) => {
            console.log(newMessage)
            if (newMessage.toUser === _id || newMessage.fromUser === _id) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket Connection Error:', err.message);
        });

        // Get initial messages
        getMessages();



        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access gallery is required!');
            }
        })();
        return () => {
            newSocket.disconnect();
        };


    }, []);

    const getMessages = () => {
        axios.get(`http://192.168.2.94:5000/messages/history?toUser=${_id}`, {
            headers: {
                Authorization: `Bearer ${userDetails.authToken}`,
            },
        }).then((response) => {
            setMessages(response.data);
        });
    }



    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            uploadImage(result);
        }
    };
    const uploadImage = async (result) => {
        let fileType = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf(".") + 1);

        // Create a FormData object
        let formData = new FormData();
        formData.append('image', {
            uri: result.assets[0].uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`
        });

        // Configure the options for the fetch request
        let options = {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
        };

        // Make the request to your server
        try {
            let response = await fetch(`${ENDPOINT}/upload`, options);
            let responseJson = await response.json();
            sendImageMessage(responseJson.imageUrl)
            console.log(responseJson);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to send image URL or identifier to the chat
    const sendImageMessage = (imageUrl) => {
        const messageData = {
            token: userDetails.authToken,
            toUser: _id,
            messageType: 'image',
            message: imageUrl, // Or any identifier for the image
        };
        console.log(imageUrl)
        socket.emit('sendMessage', messageData);
    };

    const sendMessage = () => {
        if (text && socket) {
            const messageData = {
                toUser: _id,
                message: text,
                token: userDetails.authToken,
                messageType: 'text'
            };

            socket.emit('sendMessage', messageData);

            // Optimistically add the message to the local state
            setText('');
        }
    };

    const renderItem = ({ item }) => {
        if (item.messageType === 'text') {
            return <View style={[styles.message, _id == item.toUser ? styles.sender : styles.receiver]}>
                <Text>{item.message}</Text></View>;
        } else if (item.messageType === 'image') {
            return <View style={[styles.message, _id == item.toUser ? styles.sender : styles.receiver]}>
                <TouchableOpacity onPress={() => {
                    setSelectedImage(`${ENDPOINT + item.message}`); // Replace with your image source property
                    setImageViewVisible(true);
                }}>
                    <Image
                        source={{ uri: `${ENDPOINT + item.message}` }} style={{ width: 200, height: 200 }}
                        placeholder={'dummy data'}
                    /></TouchableOpacity></View>;
        }
        // Handle other message types if necessary
    };

    // const renderItem = ({ item }) => (
    //     <View style={[styles.message, _id == item.toUser ? styles.sender : styles.receiver]}>
    //         <Text>{item.message}</Text>
    //     </View>
    // );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item._id}

            />
            <Modal
                visible={isImageViewVisible}
                transparent={true}
                onRequestClose={() => setImageViewVisible(false)}
            >
                <View style={styles.fullScreenImageContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {setImageViewVisible(false) 
                        setSelectedImage(null)}}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.fullScreenImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
            <View style={styles.inputContainer}>
                <Pressable onPress={pickImage} >
                    <AntDesign name="plus" size={24} color="rgba(90, 130, 225, 0.82)" />
                </Pressable>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Type a message"
                />
                <Pressable onPress={sendMessage} >
                    <MaterialIcons name="send" size={24} color= 'rgba(90, 130, 225, 0.82)' />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
  
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f7f7f7'
    },
    input: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(90, 130, 225, 0.82)',
        borderRadius: 5,
    },
    message: {
        padding: 10,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(90, 130, 225, 0.82)',
    },
    fullScreenImageContainer: {
        flex: 1,
        backgroundColor: 'rgba(90, 130, 225, 0.82)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      fullScreenImage: {
        width: '100%',
        height: '100%',
      },
      closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
      },
      closeButtonText: {
        color: 'white',
        fontSize: 18,
      },
      messageImage: {
        width: 150, // Set your desired size
        height: 100,
        borderRadius: 10,
      },
    sender: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(90, 130, 225, 0.19)',
    },
    receiver: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(90, 130, 225, 0.82)',
    },
});

export default ChatScreen;
