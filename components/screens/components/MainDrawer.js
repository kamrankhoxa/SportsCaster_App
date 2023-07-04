import { View, StyleSheet, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import { Button, TextInput, Searchbar, Divider } from "react-native-paper";
import { Text } from "react-native-paper";
import axios from "axios";
import useAsyncStorage from "../../services/useAsyncStorage";
import { useTheme } from "react-native-paper";
import { CategoriesButtons } from "./CategoriesButtons";

import LoginScreen from "../Login";
import RegisterScreen from "../Register";
import { NewsFeed } from "./NewsFeed";

import {
  BottomNavigation,
  Card,
  Title,
  Paragraph,
  List,
} from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import API from "../../api/APIKit";

const HomeRoute = () => {
  const theme = useTheme();

  const [categoriesData, setCategoriesData] = React.useState(null);
  const [NewsFeedData, setNewsFeedData] = React.useState(null);
  async function _getResponseCategories() {
    axios
      .get(API + "/categories")
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setCategoriesData(response.data);
      })
      .catch((err) => console.log("error " + err));
  }
  async function _getResponseNews() {
    axios
      .get(API + "/news-with-medias")
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setNewsFeedData(response.data);
        setFilteredDataSource(response.data);
      })
      .catch((err) => console.log("error " + err));
  }
  const [toggle, setToggle] = useState(false)
  useEffect(() => {
      setTimeout(() => setToggle((prevToggle) => !prevToggle), 5000);
      Promise.all(_getResponseCategories(), _getResponseNews()).catch((err) =>
      console.log("error " + err));
  } , [toggle]);
  // useEffect(() => {
  //   // console.log(JSON.parse(jwtAuth));
  //   Promise.all(_getResponseCategories(), _getResponseNews())
  //     .then((response) => {
  //       // console.log(response);
  //     })
  //     .catch((err) => console.log("error " + err));
  // }, []);

  const [search, setSearch] = useState("");
  const ref = React.useRef(null);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = NewsFeedData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.title
          ? item.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(NewsFeedData);
      setSearch(text);
    }
  };

  const searchFilterFunctionByCategory = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = NewsFeedData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.category.title
          ? item.category.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(NewsFeedData);
      setSearch(text);
    }
  };

  return (
    <>
      <View style={{ marginTop: 25 }}>
        <Searchbar
          placeholder="Search"
          placeholderTextColor={theme.colors.secondary}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          mode="bar"
          iconColor="grey"
          onIconPress={() => ref.current.focus()}
          ref={ref}
        />
      </View>
      <View style={{ marginTop: 12 }}>
        {/* <CategoriesButtons data={categoriesData} /> */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View>
            <Button
              style={{ marginLeft: 10 }}
              mode="elevated"
              onPress={() => searchFilterFunction("")}
            >
              All
            </Button>
          </View>
          {categoriesData?.map((item) => (
            <Button
              key={`category-${item?.id}`}
              style={{ marginLeft: 10 }}
              mode="elevated"
              onPress={() => searchFilterFunctionByCategory(item?.title)}
            >
              {item?.title}
            </Button>
          ))}
        </ScrollView>
      </View>
      <View style={{ marginTop: 12 }}>
        <NewsFeed data={filteredDataSource} />
      </View>
    </>
  );
};

const CommunityRoute = () => {
  const theme = useTheme();
  const [newsComData, setNewsComData] = React.useState(null);
  async function _getResponseNews() {
    axios
      .get(API + "/matches-with-medias/")
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setNewsComData(response.data);
      })
      .catch((err) => console.log("error " + err));
  }
  const [toggle, setToggle] = useState(false)
  useEffect(() => {
      setTimeout(() => setToggle((prevToggle) => !prevToggle), 5000);
      Promise.all(_getResponseNews()).catch((err) =>
      console.log("error " + err));
  } , [toggle]);


  // useEffect(() => {
  //   // console.log(JSON.parse(jwtAuth));
  //   Promise.all(_getResponseNews())
  //     .then((response) => {
  //       // console.log(response);
  //     })
  //     .catch((err) => console.log("error " + err));
  // }, []);

  const styles = {
    headlineMedium: {
      fontSize: 28,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 36,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: "400",
      letterSpacing: 0.4,
      lineHeight: 25,
      color: "#9394B3",
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: "400",
      letterSpacing: 0.25,
      lineHeight: 20,
    },
  };

  return (
    <>
      <View style={{ marginTop: 25 }}>
        <ScrollView
          vertical={true}
          showsverticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 130 }}
        >
          {newsComData?.map((item) => (
            <Card key={item.id} style={{ marginBottom: 25 }}>
              {/* <Card.Title
              title=
              subtitle=
            /> */}
              <Card.Content>
                <Text style={{
                      flex: 1,
                      textAlign: "center",
                    }} variant="titleLarge">
                  {item.Team1 + " VS " + item.Team2}
                
                </Text>
                <Text variant="titleMedium">{"Match: " + item.match}</Text>
                
                <Divider></Divider>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.bodySmall}>
                    {item.Team1} Overs: {item.overplay1}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      lineHeight: 25,
                      color: "#9394B3",
                      textAlign: "right",
                    }}
                  >
                    {item.Team2} Overs: {item.overplay2}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.bodySmall}>
                    {item.Team1} Wickets: {item.wicket1}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      lineHeight: 25,
                      color: "#9394B3",
                      textAlign: "right",
                    }}
                  >
                    {item.Team2} Wickets: {item.wicket2}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.bodySmall}>
                    {item.Team1} Score: {item.score1}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      lineHeight: 25,
                      color: "#9394B3",
                      textAlign: "right",
                    }}
                  >
                    {item.Team2} Score: {item.score2}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.bodySmall}>
                    {item.Team1}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 14,
                      lineHeight: 25,
                      color: "black",
                      textAlign: "right",
                    }}
                  >
                    {"Winer: " + item.winer}
                  </Text>
                  {/* <Text variant="titleMedium">{"Winer: " + item.winer}</Text> */}
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12,
                      lineHeight: 25,
                      color: "#9394B3",
                      textAlign: "right",
                    }}
                  >
                    {item.Team2}
                  </Text>
                </View>
                
              </Card.Content>
              {/* <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions> */}
            </Card>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const LiveRoute = () => (
  <View style={{ marginTop: 25 }}>
    <Text>LiveRoute</Text>
  </View>
);

const AccountsRoute = ({ navigation }) => <LoginScreen></LoginScreen>;

const Tab = createBottomTabNavigator();

function MyTabs({ navigation }) {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Community") {
            iconName = focused ? "ios-newspaper" : "ios-newspaper-outline";
          }
          // else if (route.name === 'Live') {
          //   iconName = focused ? 'ios-albums' : 'ios-albums-outline';
          // }
          else if (route.name === "Accounts") {
            iconName = focused ? "ios-people" : "ios-people-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        options={{ title: "Home", headerShown: false }}
        name="Home"
        component={HomeRoute}
      />
      <Tab.Screen
        options={{ title: "Community", headerShown: false }}
        name="Community"
        component={CommunityRoute}
      />
      {/* <Tab.Screen options={{ title: "Live", headerShown: false }} name="Live" component={LiveRoute} /> */}
      <Tab.Screen
        options={{ title: "Accounts", headerShown: false }}
        name="Accounts"
        component={AccountsRoute}
      />
    </Tab.Navigator>
  );
}

export default function MyComponent({ navigation }) {
  return <MyTabs />;
}
