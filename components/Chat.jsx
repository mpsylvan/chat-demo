import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Button,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import CustomActions from "./CustomActions";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from "react-native-maps";

const Chat = ({ db, storage, isConnected, route, navigation }) => {
  // puts a message array on state that will load in existing messages and accept new sent messages.
  const [messages, setMessages] = useState([]);

  const { name, color, userID } = route.params;

  // upon component mount update the navbar title option to be the state of user.
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  let unSubMessages;

  useEffect(() => {
    if (unSubMessages) unSubMessages();
    unSubMessages = null;

    if (isConnected) {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unSubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
          // call a caching function passing newMessages.
          cacheMessages(newMessages);
          setMessages(newMessages);
        });
        setMessages(newMessages);
        console.log(messages.length);
      });
    } else {
      loadCachedMessages();
    }
    // clean up all side effects but unsubbing from firestore.
    return () => {
      if (unSubMessages) unSubMessages();
    };
  }, [isConnected]);

  // accept an array as parameter, and attempt to cache it.
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem(
        "messages_cached",
        JSON.stringify(messagesToCache)
      );
    } catch (err) {
      console.log(err.message);
    }
  };
  // access
  const loadCachedMessages = async () => {
    const cachedMessages =
      (await AsyncStorage.getItem("messages_cached")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

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
            backgroundColor: "#121212",
          },
          left: {
            backgroundColor: "#efefef",
          },
        }}
      />
    );
  };
  // callback to pass to the GiftedChat InputToolbar property. Check the state of isConnected bool, if false, don't render text input toolbar.
  const renderInputToolbar = (props) => {
    return isConnected ? <InputToolbar {...props} /> : null;
  };

  // callback function to be passed in the GiftedChat custom actions prop that returns a CustomAction component with relevant prop data. 
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  // a custom view for handling messages sent explicitly with a location property, which triggers Expos MapView component in the render/return. The location object is sent in a special getLocation handler in CustomActions.js
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 180, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            longitudeDelta: 0.0922,
            latitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
      />
      {/* condition a custom React Native component that readjusts viewport to present input field with keyboard emerges  */}
      {Platform.OS === "ios" ? (
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
