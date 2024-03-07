
import { StyleSheet, Text, View } from 'react-native';

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import ChatScreen from './src/components/ChatScreen';
import TabNavigator from './src/navigation/TabNavigator';
import Context from "./src/shared/Context";




export default function App() {
  const [userDetails, setUserDetails] = useState({});
  return (

    <NavigationContainer>
      <Context.Provider value={{ userDetails, setUserDetails }}>
        {userDetails.authToken ? <TabNavigator /> : <AuthNavigator />}
      </Context.Provider>

    </NavigationContainer>


  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: "100%"
  },
});
