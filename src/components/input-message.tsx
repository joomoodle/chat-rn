import {Dimensions, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import service from '../service';
//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function InputMessage({
  message,
  setMessage,
  rest,
  id,
  handleSend,
}: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('screen').width,
        marginBottom: 20,
        columnGap: 10,
      }}>
      <TextInput
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: 280,
          backgroundColor: '#aaaaaa',
          borderRadius: 10,
          minHeight: 20,
        }}
        onChangeText={text => {
          setMessage(text);
        }}
        value={message}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#25d366',
          width: 40,
          height: 40,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={message == null || message == ''}
        onPress={async () => {
          // setMessages((old: any) => {
          //   return [
          //     ...old,
          //     {senderId: id, receiverId: rest.id, content: message},
          //   ];
          // });
          // const dto = {
          //   Content: message,
          //   receiverId: rest.id,
          // };
          // setMessage('');
          // service.post('users/chat', dto).finally(() => {});

          handleSend && handleSend(message);
          setMessage('');
        }}>
        <MaterialIcons name="send" size={20} />
      </TouchableOpacity>
    </View>
  );
}
