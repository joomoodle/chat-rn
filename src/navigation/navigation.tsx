import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../views/home';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
//@ts-ignore
import Fontisto from 'react-native-vector-icons/Fontisto';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {View} from 'react-native';
import Chats from '../views/chat';
import Settings from '../views/settings';

const Tab = createBottomTabNavigator();

const ChatStack = createStackNavigator();

const ChatStackScreen = () => (
  <ChatStack.Navigator screenOptions={{headerShown: false}}>
    <ChatStack.Screen name="ChatList" component={Home} />
    <ChatStack.Screen name="ChatDetail" component={Chats} />
  </ChatStack.Navigator>
);

function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Chats"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarActiveTintColor: '#25d366',
          tabBarInactiveTintColor: '#128c7e',
          tabBarStyle: {
            height: 90,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarLabelStyle: {fontSize: 12, marginTop: 2},
          tabBarIcon: ({color, size}) => {
            if (route.name === 'Chats')
              return <Fontisto name={'hipchat'} size={30} color={color} />;
            if (route.name === 'Setings')
              return (
                <Fontisto name={'player-settings'} size={30} color={color} />
              );
            if (route.name === 'Calls')
              return <Ionicons name={'call'} size={30} color={color} />;
            if (route.name === 'Estados')
              return (
                <MaterialCommunityIcons
                  name={'update'}
                  size={32}
                  color={color}
                />
              );
          },
        })}>
        <Tab.Screen name="Estados" component={() => <View />} />
        <Tab.Screen name="Calls" component={() => <View />} />
        <Tab.Screen name="Chats" component={ChatStackScreen} />
        <Tab.Screen name="Setings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MyTabs;
