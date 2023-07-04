import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Surface, TextInput, Button, Text } from "react-native-paper";
import axios from "axios";
// import APIKit, { setClientToken, cleartoken } from "../api/APIKit";

//Componentsts
import Logo from "../HeaderScreen";

import useAsyncStorage from "../services/useAsyncStorage";
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import API from '../api/APIKit';
export default function RegisterScreen() {
  const theme = useTheme();
//   const [jwtAuth, updatejwtAuth, clearjwtAuth] = useAsyncStorage("@jwt:token");
const navigation = useNavigation(); 
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [responseError, setresponseError] = React.useState("");
  

  const _onRegisterPress = () => {
    if (username != "" && pass != "" && email != "" && name != "") {
      let payload = {
        name: name,
        username: username,
        email: email,
        password: pass,
      };
      // cleartoken();
      axios.post(API+"/auth/local/register", payload)
        .then((response) => {
          let jwt = JSON.stringify(response.data.jwt);
        //   setToken(jwt);
          let user_data = JSON.stringify(response.data.user);
        //   setUser(user_data);
          console.log("User profile", user_data);
          console.log("User token", jwt);
          if (jwt != null || jwt != "") {
            navigation.navigate("Login");
          }
        })
        .catch((error) => {
        //   console.log("An error occurred:", error.response);
          console.log(error.response);
          setresponseError("Check username or password");
        });

      //alert('Done');
    } else {
        setresponseError("Please fill data");
      //alert for the empty InputText
    }
  };

  const _onGoLogin = () => {
    navigation.goBack("Login");
    // console.log(LoginOrRegister);
    // updateLoginOrRegister('login');
  }

  return (
    <View style={styles.main} colors={theme.colors.surface}>
      <View style={styles.container}>
        <Logo style={styles.logo} />
      </View>
      <TextInput
        label="Name"
        placeholder="abc"
        mode="outlined"
        onChangeText={(name) => setName(name)}
      />
      <TextInput
        label="Email"
        placeholder="abc"
        mode="outlined"
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        label="Username"
        placeholder="abc"
        mode="outlined"
        onChangeText={(username) => setUsername(username)}
      />

      <TextInput
        label="Password"
        placeholder="*******"
        mode="outlined"
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
        onChangeText={(pass) => setPass(pass)}
      />
      <View>
      <Text variant="labelSmall" style={{textAlign:'left',color:theme.colors.primary}}>{responseError}</Text>
      </View>
      <View style={styles.container_main}>
        <Button buttonColor={theme.colors.primary} icon="account" textColor={theme.colors.onPrimary} mode="contained" onPress={_onRegisterPress}>
          Register
        </Button>
      </View>
      <View>
      <TouchableOpacity onPress={_onGoLogin}>
        <Text style={{textAlign:'right'}}>Already account?</Text>
      </TouchableOpacity>
      </View>
      {/* <Button buttonColor={theme.colors.onPrimary} icon="account" textColor={theme.colors.primary} mode="contained" onPress={_getUser}>
        Get Jwt
      </Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 8,
    width: '100%',
    justifyContent: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  container_main: {
    margin: 8,
  },
  
});
