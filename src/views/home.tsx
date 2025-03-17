import {useCallback, useMemo} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import service from '../service';
//@ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addUsers} from '../redux/slice/chatSlice';
export default function Home({navigation}: any) {
  const {users, lastMessages} = useSelector((state: any) => state.chat);
  const {jwtToken} = useSelector((state: any) => state.user);

  const dispath = useDispatch();

  useFocusEffect(
    useCallback(() => {
      service.get('users/chat-user').then(res => {
        if (res.data) {
          //@ts-ignore
          dispath(addUsers(res.data));
        }
      });

      return () => {};
    }, [dispath]),
  );
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: Platform.OS == 'ios' ? 60 : 5,
        paddingHorizontal: 10,
        rowGap: 20,
      }}>
      <View
        style={{
          flexDirection: 'column',
          width: Dimensions.get('screen').width * 0.9,
        }}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 32,
            width: Dimensions.get('screen').width * 0.9,
          }}>
          NBOX
        </Text>
      </View>

      <Text
        style={{
          fontWeight: '600',
          fontSize: 26,
          width: Dimensions.get('screen').width * 0.9,
        }}>
        Mis Chats
      </Text>

      <View
        style={{
          width: Dimensions.get('screen').width * 0.9,
          paddingHorizontal: 10,
          paddingVertical: 15,
          borderRadius: 29,
          borderWidth: 1,
          borderColor: '#25d366',
          flexDirection: 'row',
          columnGap: 5,
        }}>
        <Ionicons name="search" size={22} />
        <TextInput
          placeholder="Buscar mensajes"
          style={{
            width: '90%',
          }}
        />
      </View>
      <FlatList
        data={users}
        renderItem={({item, index}) => {
          const last = lastMessages[`${item.id}_${id}`];

          return (
            <TouchableOpacity
              style={{
                width: Dimensions.get('screen').width * 0.9,
                flexDirection: 'row',
                rowGap: 10,
                columnGap: 10,
              }}
              key={index}
              onPress={() => {
                //@ts-ignore
                navigation.navigate('ChatDetail', {...item});
              }}>
              <Image
                source={{
                  //@ts-ignore
                  uri: item?.avatar
                    ? item.avatar
                    : 'https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg',
                }}
                style={{height: 50, width: 50, borderRadius: 50}}
              />
              <View
                style={{
                  flexDirection: 'column',
                  width: Dimensions.get('screen').width * 0.9 - 80,
                  rowGap: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {/* @ts-ignore */}
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '200',
                      fontSize: 12,
                    }}>
                    {/* @ts-ignore */}
                    {item.time}
                  </Text>
                </View>
                <Text
                  style={{
                    fontWeight: '300',
                    fontSize: 15,
                  }}>
                  {/* @ts-ignore */}
                  {last ? last?.content : ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
      />
    </View>
  );
}
