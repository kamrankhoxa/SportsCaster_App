import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Surface, TextInput, Button, Text } from "react-native-paper";
import axios from "axios";
// import APIKit, { setClientToken, cleartoken } from "../api/APIKit";

//Componentsts
import Logo from "../HeaderScreen";
import { useNavigation } from '@react-navigation/native';

import useAsyncStorage from "../services/useAsyncStorage";
import { useTheme } from "react-native-paper";
import API from '../api/APIKit';

export default function LoginScreen() {
  const navigation = useNavigation(); 

  const theme = useTheme();
  const [jwtAuth, updatejwtAuth, clearjwtAuth] = useAsyncStorage("@jwt:token");
  const [userData, updateuserData, clearuserData] = useAsyncStorage("userdata");
  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");

  const [user, setUser] = React.useState([]);
  const [token, setToken] = React.useState([]);
  const [responseError, setresponseError] = React.useState("");
  const _onLoginPress = () => {
    if (username != "" && pass != "") {
      let payload = {
        identifier: username,
        password: pass,
      };
      axios
        .post(API+`/auth/local`, payload)
        .then((response) => {
          let jwt = JSON.stringify(response.data.jwt);
          setToken(jwt);
          let user_data = JSON.stringify(response.data);
          setUser(user_data);
          console.log("User profile", user_data);
          console.log("User token", jwt);
          if (jwt != null || jwt != "") {
            updatejwtAuth(jwt);
            updateuserData(user_data);
            navigation.navigate("Dashboard");
          }
        })
        .catch((error) => {
          // console.log(error.response.data.error.message);
          setresponseError("Invalid username or passowrd");
        });

      //alert('Done');
    } else {
      // alert("Please fill data");
      setresponseError("Please fill data");
      //alert for the empty InputText
    }
  };
  const _getUser = async () => {
    console.log(jwtAuth);
  };

  useEffect(() => {
    if (jwtAuth != null) {
      navigation.replace("Dashboard");
    }
  }, [jwtAuth]);

  const _onGoRegister = () => {
    navigation.navigate("Register");
    // console.log(LoginOrRegister);
    // updateLoginOrRegister('register');
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.main} colors={theme.colors.surface}>
      <View style={styles.container}>
        <Logo style={styles.logo} />
      </View>

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
        secureTextEntry={!showPassword}
        right={<TextInput.Icon onPress={togglePasswordVisibility} icon="eye" />}
        onChangeText={(pass) => setPass(pass)}
      />
      <View>
        <Text
          variant="labelSmall"
          style={{ textAlign: "left", color: theme.colors.primary }}
        >
          {responseError}
        </Text>
      </View>
      <View style={styles.container_main}>
        <Button
          buttonColor={theme.colors.primary}
          icon="account"
          textColor={theme.colors.onPrimary}
          mode="contained"
          onPress={_onLoginPress}
        >
          Login
        </Button>
      </View>
      <View>
        <TouchableOpacity onPress={_onGoRegister}>
          <Text style={{ textAlign: "right" }}>Don't have account?</Text>
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
    width: "100%",
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
