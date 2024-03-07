import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatList from '../components/ChatList';
import ChatScreen from '../components/ChatScreen';


const Stack = createNativeStackNavigator();

const TabNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
              backgroundColor: 'rgba(90, 130, 225, 0.82)', // Example background color
            },
            headerTintColor: '#fff', // Example text color
            headerTitleStyle: {
              fontWeight: 'bold', // Example font weight
            },
          }}>
            <Stack.Screen name="chatlist" component={ChatList} />
            <Stack.Screen name="chatscreen" component={ChatScreen}  options={({ route }) => ({
            title: route.params.item.username?route.params.item.username:"chatscreen"
          })} />
        </Stack.Navigator>
    );
}
export default TabNavigator;
