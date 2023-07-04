import React from "react";
import { View, StyleSheet, Image, ScrollView, FlatList } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextInput, Searchbar } from "react-native-paper";
import { BottomNavigation, Text } from "react-native-paper";
// import APIKit, { setClientToken, cleartoken } from "../../api/APIKit";
import useAsyncStorage from "../../services/useAsyncStorage";

export const CategoriesButtons = (props) => {
  const [categoriesData, setCategoriesData] = React.useState([]);
  useEffect(() => {
    console.log(props.data);
    setCategoriesData(props.data);
  }, [props.data]);
  return (
    <>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View>
          <Button
            style={{ marginLeft: 10 }}
            mode="elevated"
            onPress={() => console.log("Pressed")}
          >
            All
          </Button>
        </View>
        {categoriesData?.map(({ id, attributes }) => (
          <Button
            key={`category-${id}`}
            style={{ marginLeft: 10 }}
            mode="elevated"
            onPress={() => console.log(`id: ${id}`)}
          >
            {attributes.title}
          </Button>
        ))}
      </ScrollView>
    </>
  );
};
