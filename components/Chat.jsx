import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';


const Chat = ({route, navigation}) => {

const [messages, setMessages] = useState([]);

const {user, color} = route.params;

useEffect(()=>{
    navigation.setOptions({title: user, color: color})
}, []);

useEffect(()=>{
  setMessages([
    {
      _id: 1,
      text: 'Hello Developer',
      createdAt : new Date(),
      user: {
        _id: 2, 
        name : 'React Native',
        avatar: 'https://placeimg.com/140/140/any'
      },
    },
    {
      _id: 2, 
      text: 'User is not online currently.',
      createdAt: new Date(),
      system: true,
    }
  ]);
},[])

const onSend = (newMessages)=>{
  setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
}

const renderBubble = ( props )=>{
  return (
    <Bubble
      {... props}
      wrapperStyle = {{
        right: {
          backgroundColor: 'black'
        },
        left: {
          backgroundColor : '#d8d'
        }
      }}
    />
  )
}

 return (
    <View style={styles.container}>
      <GiftedChat 
        messages = {messages}
        renderBubble = {renderBubble}
        onSend = {messages => onSend(messages)}
        user = {{
          _id: 1,
        }}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
 );
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
 }, 
 userSpan:{
    fontSize: 20,
    color: "#d88228"
 }
});

export default Chat;