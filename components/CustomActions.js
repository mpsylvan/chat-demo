import { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


// custom actions component that extracts stylings, onSend send methods, and a firebase storage reference.
const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  storage,
  userID,
}) => {

  // expos custom action sheet. 
  const actionSheet = useActionSheet();

  // function to create a unique reference string combining userID, timestamp and the file name. Will be the reference variable when uploading a new ref to firebase storage. 
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // configures the reference to firebase storage, fetches the data via uri on the device, configures it into blob and then attemps to upload to firebase storage. Accesses the download URL and
  // then uses it as the image url in the onSend method.  
  const uploadAndSendImage = async (imageURI) => {
    const uniqueStringRef = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueStringRef);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      console.log("File Uploaded");
      const imageURL = await getDownloadURL(snapshot.ref);
      console.log(imageURL);
      onSend({ image: imageURL });
    });
  };

  
  const selectImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        const image = result.assets[0];
        uploadAndSendImage(image.uri);
      } else {
        Alert.alert("unable to send image at this time.");
      }
    }
  };

  const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    if (permissions?.granted) {
      console.log(permissions);
      let result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        const image = result.assets[0];
        uploadAndSendImage(image.uri);
      } else {
        Alert.alert("unable to send image.");
      }
    }
  };

  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();

    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        console.log("location accessed")
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else {
        Alert.alert("Error occured while fetching location. ");
      }
    } else {
      Alert.alert("Location permissions have not been granted");
    }
  };

  const onActionPress = () => {
    const options = [
      `Pick Image from Library`,
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            selectImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      }
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 35,
    height: 30,
    marginLeft: 12,
    marginBottom: 10,
  },
  wrapper: {
    backgroundColor: "#000",
    borderRadius: 13,
    borderColor: "#000",
    borderWidth: 2,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    width: 30,
  },
  iconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;
