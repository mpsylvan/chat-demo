import { StyleSheet, View, Text, KeyboardAvoidingView } from "react-native";
import { useEffect, useState } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  // puts a message array on state that will load in existing messages and accept new sent messages.
  const [messages, setMessages] = useState([]);

  const { user, color, userID } = route.params;

  // every time the component mounts load props data passed from Start.jsx into navigation bar display options.
  useEffect(() => {
    navigation.setOptions({ title: userID });
  }, []);

  // every mount of Chat component, load in an array of static message objects onto state; the objects meet the configurations of a <GiftedChat/> component and it's props.
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello Developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
        renderUsernameOnMessage: true,
      },
      {
        _id: 2,
        text: "New Message incoming ...",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
          renderUsernameOnMessage: true,
        },
      },
      {
        _id: 3,
        text: `${user} has entered the chat.`,
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // resets the 'messages' state to append the newest message on every SEND executed within GiftedChat component.
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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
          _id: 1,
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
