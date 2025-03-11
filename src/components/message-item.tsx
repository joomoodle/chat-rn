import {Dimensions, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';

export default function MessageItem({item, rest}: any) {
  return (
    <View
      style={{
        alignItems: item.senderId !== rest.id ? 'flex-end' : 'flex-start',
        width: Dimensions.get('screen').width,
        paddingHorizontal: 10,
      }}>
      <TouchableOpacity
        style={{
          width: Dimensions.get('screen').width * 0.9,
          flexDirection: 'row',
          rowGap: 10,
          columnGap: 10,
          backgroundColor: item.senderId !== rest.id ? '#075e54' : '#aaaaaa',
          minHeight: 30,
          borderRadius: 10,
          paddingHorizontal: 6,
          paddingVertical: 8,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
          }}>
          {item.content}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
