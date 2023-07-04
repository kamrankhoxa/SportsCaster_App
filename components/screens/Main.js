import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";

import { Button, TextInput, Searchbar } from "react-native-paper";
import { BottomNavigation, Text } from "react-native-paper";
import axios from "axios";
import useAsyncStorage from "../services/useAsyncStorage";
import { useTheme } from "react-native-paper";

import MyComponent from "./components/MainDrawer";
export default function MainScreen({ navigation }) {
    const theme = useTheme();

return(
    <MyComponent></MyComponent>
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
  