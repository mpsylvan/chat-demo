import { StyleSheet, View, Text, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Chat = ({ db, isConnected, route, navigation }) => {
  // puts a message array on state that will load in existing messages and accept new sent messages.
  const [messages, setMessages] = useState([]);

  const { user, color, userID } = route.params;

  // upon component mount update the navbar title option to be the state of user. 
  useEffect(() => {
    navigation.setOptions({ title: user });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unSubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
        setMessages(newMessages);
      });
    });
    return () => {
      if (unSubMessages) {
        unSubMessages();
      }
    };
  }, []);

  // resets the 'messages' state to append the newest message on every SEND executed within GiftedChat component.
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // function that returns a customization object with props awareness which will be loaded as a callback on the renderBubble prop in the GiftedChat component.
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
            color: "pink",
          },
          left: {
            backgroundColor: "#fff",
            color: "#000",
          },
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: user,
        }}
      />
      {/* condition a custom React Native component that readjusts viewport to present input field with keyboard emerges  */}
      {Platform.OS === "ios" || "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // stretch the parent container to take up the full flex area.
  container: {
    flex: 1,
  },
  //  userSpan:{
  //     fontSize: 20,
  //     color: "#d88228"
  //  }
});

export default Chat;
