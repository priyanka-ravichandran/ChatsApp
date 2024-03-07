import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../components/Login';
import Signup from '../components/Signup';


const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="signup" component={Signup} />
        </Stack.Navigator>
    );
}
export default AuthNavigator;
