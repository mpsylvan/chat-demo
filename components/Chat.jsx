import { StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';

const Chat = ({route, navigation}) => {

const {user, color} = route.params;

useEffect(()=>{
    navigation.setOptions({title: user, color: color})
}, []);

 return (
   <View style={[styles.container, {backgroundColor: color} ]}>
     <Text style={{color: "#fff"}}>Hello <Text style={styles.userSpan}>{user} </Text></Text>
   </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 }, 
 userSpan:{
    fontSize: 20,
    color: "#d88228"
 }
});

export default Chat;