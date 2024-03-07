import React, { useState, useContext, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Context from "../shared/Context";
import axios from 'axios';




const ChatList = ({ navigation }) => {
    const [contact, setContact] = useState([])
    const { userDetails } = useContext(Context);

    const [isModalVisible, setModalVisible] = useState(false);
    const [newContactName, setNewContactName] = useState("");

    useEffect(() => {
        axios.get('http://192.168.2.94:5000/contacts/getContacts', {
            headers: {
                Authorization: `Bearer ${userDetails.authToken}`,
            },
        }).then((response) => {
            setContact(response.data);
        });
    }, []);

    const handlePress = () => {
        const postData = {
            "contactUsername": newContactName
        };
        axios.post('http://192.168.2.94:5000/contacts/addContact', postData, {
            headers: {
                Authorization: `Bearer ${userDetails.authToken}`,
            },
        }).then((response) => {
            setModalVisible(false);
            setNewContactName("");
            console.log(response);
            setContact(currentContacts => [...currentContacts, { username: newContactName, _id: response.data._id }]);
        }).catch((error) => {
            // Revert changes on error
            console.error('Failed to add contact:', error);
            setContact(currentContacts => currentContacts.filter(c => c.username !== newContactName));
            // Optionally, show an error message to the user
        });

    }





    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("chatscreen",{ item })}
            style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
        >
            <Text style={{ fontSize: 18 }}>
                {item.username}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={contact}
                renderItem={renderItem}
                keyExtractor={(item) => item?._id?.toString()}
            />
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        console.log("in");
                        setModalVisible(true);
                    }}
                >
                    <MaterialIcons name="add" size={24} color="white" />
                </TouchableOpacity></View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable
                            style={styles.modalClose}
                            onPress={() => setModalVisible(false)}
                        >
                            <MaterialIcons name="close" size={24} color="black" />
                        </Pressable>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                placeholder="Contact Name"
                                value={newContactName}
                                onChangeText={setNewContactName}
                            />

                        </View>
                        <Pressable style={styles.modalButton} onPress={handlePress}>
                            <Text style={styles.modalButtonText}>Add Contact</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButton: {
        backgroundColor: "rgba(90, 130, 225, 0.82)",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalClose: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    addButton: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "rgba(90, 130, 225, 0.82)",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ChatList;
