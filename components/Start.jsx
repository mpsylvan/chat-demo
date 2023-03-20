import { StyleSheet, Text, View, Button, TextInput, ImageBackground, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import { useState } from "react";

const Start = ({navigation}) => {

const [user, setUser] = useState("");
const [color, setColor] = useState("#090C08");
const image = {uri: './img/background.png'};

//  function that alters that resets the state of color variable based on user selection, loaded onto touch components. 
colorSync = (hex) =>{
    setColor(hex)
    console.log(color, hex);
}

  return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.backgroundImage}
                 source={require('./img/background.png')}
                 resizeMode = "cover"
            >   
            
                <View style={styles.startTop}>
                    <Text style={[styles.topTitle]}>Chat App</Text>
                </View>
                <View style={styles.startBottom}>
                    <View style={styles.actionBox}>
                        {/* user input, linked to state variable of user.  */}
                        <TextInput
                            inlineImageLeft=""
                            style={styles.textInput}
                            value={user}
                            placeholder="Input your username"
                            onChangeText={setUser}
                        />
                        <View style={styles.chooseText}>  
                            <Text style={{fontSize: 16, fontWeight: 300, color: "#757083", margin: 10, position: "relative", left: -10}}>Choose Background Color: </Text>
                        </View>
                        {/* renders 4 color 'choices' that also trigger an onPress function that alters that state of 'color' */}
                         <View style={styles.colorCircleContainer}>
                            <TouchableOpacity onPress = {()=>{colorSync("#595C58")}} style={[styles.colorCircle, {backgroundColor: "#595958"}]}></TouchableOpacity>
                            <TouchableOpacity onPress = {()=>{colorSync("#474056")}} style={[styles.colorCircle, {backgroundColor: "#474056"}]}></TouchableOpacity>
                            <TouchableOpacity onPress = {()=>{colorSync("#8A95A5")}} style={[styles.colorCircle, {backgroundColor: "#8A95A5"}]}></TouchableOpacity>
                            <TouchableOpacity onPress = {()=>{colorSync("#B9C6AE")}} style={[styles.colorCircle, {backgroundColor: "#B9C6AE"}]}></TouchableOpacity>
                        </View>
                        <TouchableOpacity
                        // loads the navigate method onto the onPress event of this component, pointing to 'Chat' connection string, and flows user data / color preference data through props into the Chat component. 
                            onPress= {()=>navigation.navigate('Chat', {user: user, color: color})} 
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </TouchableOpacity>
                    </View>
                </View>
 
             </ImageBackground>
             { Platform.OS === 'ios' || 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        
    },
    textInput : {
        width: "88%",
        height: 50,
        margin: 10,
        borderWidth: 2,
        padding: 8,
        borderColor: "#757083",
        color: "#757083",
        borderRadius: 2,
    },
    button: {
        backgroundColor: "#757083",
        width: "88%",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        margin: 20,
        borderRadius: 2,
    },
    buttonText:{
        color: "#FFF"
    },
    startTop:{
        flex: .9,
        // backgroundColor: "blue",
        width: "100%",
        justifyContent: "center",
        alignItems: "center", 
    },
    topTitle:{
        fontSize: 45,
        color: "#fff",
        fontWeight: 600,
        position: "relative", 
        
    },
    startBottom:{
        flex: 1,
        width: "100%",
        // backgroundColor: "#bbb",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "justify",

    }, 
    actionBox: {
        width: "88%",
        height: 275,
        backgroundColor: "#eeeeee",
        alignItems: "center",
        justifyContent: "center",
    },
    colorCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#090C08",
        marginRight: 12,

    }, 
    colorCircleContainer:{
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: "88%",
        height: 55,
        // backgroundColor: "coral"
    }, 
    backgroundImage:{
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        width: "100%",
        height: "100%",
    }, 
    chooseText: {
        // backgroundColor: "orange",
        width: "88%",
        alignItems: "flex-start"
        
    }
})

export default Start;