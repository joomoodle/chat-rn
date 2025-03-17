import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//@ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const CustomHeader = ({navigation, name, avatar}: any) => {
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
            source={
              avatar
                ? {uri: avatar}
                : {
                    uri: 'https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg',
                  }
            }
            style={{height: 35, width: 35, borderRadius: 50}}
            resizeMode="cover"
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
