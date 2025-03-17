import {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, FlatList, ImageBackground, View} from 'react-native';
import * as signalR from '@microsoft/signalr';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MessageItem from '../components/message-item';
import InputMessage from '../components/input-message';
import {addLastMessage, addMessage} from '../redux/slice/chatSlice';
import {CustomHeader} from '../components/heade';

export default function Chats({navigation, route}: any) {
  const dispatch = useDispatch();

  const flatListRef = useRef(null);
  const {...rest} = route.params;
  const {jwtToken} = useSelector((state: any) => state.user);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');

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

  const allMessages = useSelector((state: any) => state.chat.messages);

  const messages = useMemo(() => {
    return allMessages[`${rest.id}_${id}`] || [];
  }, [allMessages, rest, id]);

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
  }, [navigation, rest]);

  useEffect(() => {
    // Esto hará que el FlatList se desplace hasta el último mensaje
    setTimeout(() => {
      if (flatListRef.current) {
        //@ts-ignore
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100); // El retraso es opcional, puedes ajustarlo según lo que desees
  }, [messages]);


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
          //@ts-ignore
          const [recive, sender] = senderId.split('_');
          //@ts-ignore
          if (recive == id && sender == rest.id) {
            dispatch(
              addMessage({
                id: Date.now().toString(),
                chatId: `${rest.id}_${id}`,
                senderId: parseInt(sender),
                content: message,
                receiverId: parseInt(recive),
                timestamp: Date.now().toString(),
              }),
            );
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
  }, [jwtToken, dispatch]);

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
          ItemSeparatorComponent={() => <View style={{height: 5}} />}
          style={{
            minHeight: 40,
            marginBottom: 10
          }}
        />
        <InputMessage
          message={message}
          setMessage={setMessage}
          rest={rest}
          id={id}
          handleSend={async (message: string) => {
            const dto = {
              id: Date.now().toString(),
              chatId: `${rest.id}_${id}`,
              senderId: parseInt(id),
              content: message,
              receiverId: parseInt(rest.id),
              timestamp: Date.now().toString(),
            };
            dispatch(addMessage(dto));
            dispatch(addLastMessage(dto));
            if (connection) {
              //@ts-ignore
              await connection.send('SendMessage', `${rest.id}_${id}`, message);
            }
          }}
        />
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}
