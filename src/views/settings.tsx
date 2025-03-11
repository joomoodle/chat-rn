import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {setPhoto, setToken} from '../redux/slice/userSlice';
import service from '../service';
import {useEffect, useState} from 'react';

export default function Settings({navigation}: any) {
  const {photo, userName} = useSelector((state: any) => state.user);
  const [form, setForm] = useState({name: ''});
  const dispath = useDispatch();

  useEffect(() => {
    setForm({name: userName});
  }, [userName]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: 100,
        paddingHorizontal: 10,
        rowGap: 20,
      }}>
      <View
        style={{
          flexDirection: 'column',
          rowGap: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontWeight: '600',
            fontSize: 32,
            width: Dimensions.get('screen').width * 0.9,
          }}>
          NBOX
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const result = await launchImageLibrary({
              mediaType: 'photo',
            });

            if (result && result.assets) {
              dispath(
                setPhoto({
                  LogoPerfil: result.assets[0].uri ?? '',
                  NombreCompleto: '',
                }),
              );
            }
          }}>
          <Image
            source={{
              uri: photo
                ? photo
                : 'https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg',
            }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
          }}>
          Hola, Bienvenido Ingresa tu nombre
        </Text>

        <TextInput
          style={{
            borderColor: '#25d366',
            borderWidth: 1,
            width: Dimensions.get('screen').width * 0.9,
            paddingVertical: 20,
            borderRadius: 10,
            paddingHorizontal: 5,
            fontSize: 16,
          }}
          onChangeText={text => {
            setForm({name: text});
          }}
          value={form.name}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#128c7e',
            width: Dimensions.get('screen').width * 0.9 - 100,
            paddingVertical: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={async () => {
            service
              .post('users/register-user', {
                name: form.name,
                lastName: 'abd',
                secondLastName: '',
                email: 'juan@gmail.com',
              })
              .then(res => {
                //@ts-ignore
                if (res.data && res.data?.token) {
                  dispath(
                    setToken({
                      email: '',
                      //@ts-ignore
                      jwtToken: res.data.token,
                      userName: form.name,
                      refreshToken: '',
                    }),
                  );
                  navigation.goBack();
                }
              });
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '500',
            }}>
            CONTINUAR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
