import {useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as signalR from '@microsoft/signalr';
import {useSelector} from 'react-redux';
import service from '../service';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MessageItem from '../components/message-item';
import InputMessage from '../components/input-message';

const propsChat = {
  user: 'pepito',
  avatar: require('../assets/avatar_1.png'),
};

type TChat = {
  senderId: number;
  content: string;
};

const CustomHeader = ({navigation, name, avatar}: any) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: Dimensions.get('screen').width,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: Platform.OS == 'ios' ? 50 : 0,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons name="arrow-back-ios" size={22} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: 10,
          }}>
          <Image
            source={avatar ? avatar : propsChat.avatar}
            style={{height: 35, width: 35, borderRadius: 50}}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            {name}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          columnGap: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MaterialIcons name="call" size={22} />
        <MaterialIcons name="missed-video-call" size={28} />
      </View>
    </View>
  );
};
export default function Chats({navigation, route}: any) {
  const flatListRef = useRef(null);
  const {...rest} = route.params;
  const {jwtToken} = useSelector((state: any) => state.user);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<TChat>>([]);

  const id = useMemo(() => {
    if (!jwtToken) return null;
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      return decodedData.id;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }, [jwtToken]);

  useEffect(() => {
    navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});
    navigation.setOptions({
      header: () => (
        <CustomHeader
          navigation={navigation}
          name={rest.name}
          avatar={rest.avatar}
        />
      ),
      headerShown: true,
    });

    return () => {
      navigation
        .getParent()
        ?.setOptions({tabBarStyle: {height: 65, paddingBottom: 10}});
    };
  }, [navigation]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     //@ts-ignore
  //     flatListRef.current?.scrollToEnd({animated: true});
  //   }, 500); // Espera a que los mensajes se rendericen
  // }, [messages]);

  useEffect(() => {
    const connect = async () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://api-qa.app.midinerito.mx/real-time', {
          skipNegotiation: true,
          accessTokenFactory: () => jwtToken,
          transport: 1,
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        newConnection.on('ReceiveMessage', (senderId, message) => {
          const [recive, sender] = senderId.split('_');
          console.log({recive, sender});
          if (recive == id && sender == rest.id) {
            //@ts-ignore
            setMessages(prevMessages => [
              ...prevMessages,
              {
                senderId: parseInt(sender),
                content: message,
                receiverId: parseInt(recive),
              },
            ]);
          }
        });

        //@ts-ignore
        setConnection(newConnection);
      } catch (err) {
        console.error('Error en la conexión:', err);
      }
    };

    connect();

    return () => {
      if (connection) {
        //@ts-ignore
        connection.stop();
      }
    };
  }, [jwtToken]);

  useEffect(() => {
    getAllMessage();
  }, [jwtToken]);

  const getAllMessage = () => {
    service.get(`users/messages/${rest.id}`).then(res => {
      //@ts-ignore
      setMessages(res.data);
    });
  };

  return (
    <KeyboardAwareScrollView
      style={{
        flex: 1,
      }}>
      <ImageBackground
        style={{
          width: Dimensions.get('screen').width,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          height: Dimensions.get('screen').height - 101,
          paddingVertical: 10,
        }}
        source={require('../assets/bg_1.jpeg')}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({item, index}) => {
            return <MessageItem rest={rest} item={item} />;
          }}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          style={{
            minHeight: 40,
          }}
        />
        <InputMessage
          message={message}
          setMessage={setMessage}
          rest={rest}
          id={id}
          setMessages={setMessages}
        />
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}
