import {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import service from '../service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
export default function Home({navigation}: any) {
  const [users, setUsers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      service.get('users/chat-user').then(res => {
        console.log(res);
        //@ts-ignore
        setUsers(res.data);
      });

      return () => {
        // Puedes limpiar efectos aquí si es necesario
      };
    }, []),
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 60,
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
                  uri: 'https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg',
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
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '200',
                      fontSize: 12,
                    }}>
                    {item.time}
                  </Text>
                </View>
                <Text
                  style={{
                    fontWeight: '300',
                    fontSize: 15,
                  }}>
                  {item.lastMessage}
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
