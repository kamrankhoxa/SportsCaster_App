import React, { useEffect, useState } from "react";
//Navigations
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// You can import from local files
import MainScreen from "./components/screens/Main";
import LoginScreen from "./components/screens/Login";
import DashboardScreen from "./components/screens/Dashboard";
import RegisterScreen from "./components/screens/Register";
import SingleNewsFeed from "./components/screens/SingleNewsFeed"
import useAsyncStorage from "./components/services/useAsyncStorage";

import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";

const Stack = createNativeStackNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(192, 1, 0)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 218, 212)",
    onPrimaryContainer: "rgb(65, 0, 0)",
    secondary: "rgb(119, 86, 81)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 218, 212)",
    onSecondaryContainer: "rgb(44, 21, 18)",
    tertiary: "rgb(112, 92, 46)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(251, 223, 166)",
    onTertiaryContainer: "rgb(37, 26, 0)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(32, 26, 25)",
    surface: "rgb(243, 221, 224)",
    onSurface: "rgb(32, 26, 25)",
    surfaceVariant: "rgb(245, 221, 218)",
    onSurfaceVariant: "rgb(83, 67, 65)",
    outline: "rgb(133, 115, 112)",
    outlineVariant: "rgb(216, 194, 190)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(54, 47, 46)",
    inverseOnSurface: "rgb(251, 238, 236)",
    inversePrimary: "rgb(255, 180, 168)",
    elevation: {
      level0: "transparent",
      level1: "rgb(252, 239, 242)",
      level2: "rgb(250, 231, 235)",
      level3: "rgb(248, 224, 227)",
      level4: "rgb(247, 221, 224)",
      level5: "rgb(246, 216, 219)",
    },
    surfaceDisabled: "rgba(32, 26, 25, 0.12)",
    onSurfaceDisabled: "rgba(32, 26, 25, 0.38)",
    backdrop: "rgba(59, 45, 43, 0.4)",
  }, // Copy it from the color codes scheme and then use it here
};
export default function App() {
  const [jwtAuth, updatejwtAuth, clearjwtAuth] = useAsyncStorage("@jwt:token");
  return (
    <>
      <PaperProvider theme={theme}>
        <NavigationContainer>
        <Stack.Navigator initialRouteName={{jwtAuth}?'Main':'Dashboard'}>
        <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ title: "Main", headerShown: false }}
            />
            {/* <Stack.Screen
              name="SingleNewsFeed"
              component={SingleNewsFeed}
              options={{ title: "SingleNewsFeed", headerShown: true }}
            /> */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Register", headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: "Dashboard", headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </>
  );
}
