import React from "react";
import {
  Image,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { Button, TextInput, IconButton, Searchbar } from "react-native-paper";
import { BottomNavigation, DataTable, Text } from "react-native-paper";
import axios from "axios";
import useAsyncStorage from "../services/useAsyncStorage";
import { useTheme } from "react-native-paper";
// import { CategoriesButtons } from "./components/CategoriesButtons";
// import { NewsFeed } from "./components/NewsFeed";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import * as DocumentPicker from "expo-document-picker";

import * as ImagePicker from "expo-image-picker";
import FormData from "form-data";
//time moment
// import Moment from "react-moment";
import "moment-timezone";
import moment from "moment";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createIconSet } from "@expo/vector-icons";
import { Dialog, Modal, Portal, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/APIKit";
import { useUploadNewsImage, useUploadNewsVideo } from "../services/useUpload";

function DashboardRoute({ navigation }) {
  const [jwtAuth, updatejwtAuth, clearjwtAuth] = useAsyncStorage("@jwt:token");
  const [userData, updateuserData, clearuserData] = useAsyncStorage("userdata");
  const theme = useTheme();

  const _logout = () => {
    clearjwtAuth();
    clearuserData();
    navigation.replace("Main");
  };
  const _getUserDt = async () => {
    var data = await AsyncStorage.getItem("userdata");
    var data = JSON.parse(data);
    setUserDt(data);
    console.log(data);
  };

  const [userDt, setUserDt] = React.useState(null);
  useEffect(() => {
    Promise.all(_getUserDt()).then();
  }, []);
  return (
    <>
      <View style={{ marginTop: 25 }}>
        <Text>Welcome Mr/Mrs {userDt?.user.name} </Text>
        <Button
          buttonColor={theme.colors.onPrimary}
          icon="account"
          textColor={theme.colors.primary}
          mode="contained"
          onPress={_logout}
        >
          Logout
        </Button>
      </View>
    </>
  );
}

const CategoriesRoute = ({ navigation }) => {
  const theme = useTheme();

  const [title, settitle] = React.useState("");
  const [descriptions, setdescriptions] = React.useState("");
  const [responseError, setresponseError] = React.useState("");

  const [search, setSearch] = useState("");
  const ref = React.useRef(null);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  //diaglog add
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  //diaglog update
  const [isUpdateDialogVisible, setIsUpdateDialogVisible] = useState(false);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item?.title
          ? item?.title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      // Flat List Item
      <>
        {/* <Text
          style={{ marginTop: 10, marginBottom: 10, position: "relative" }}
          onPress={() => getItem(item)}
        >
          {item.id}
          {"."}
          {item.attributes.title.toUpperCase()}
        </Text> */}
        <DataTable.Row
         key={`rowc-${item.id}`}
          onPress={() => {
            _onRowClick(
              item.id,
              item.title,
              item.descriptions
            );
            setIsUpdateDialogVisible(true);
            setresponseError("");
          }}
        >
          <DataTable.Cell>{item.title.toUpperCase()}</DataTable.Cell>
          <DataTable.Cell  key={`rowc1-${item.id}`} numeric>
            {item.descriptions.toUpperCase()}
          </DataTable.Cell>
          <DataTable.Cell  key={`rowc2-${item.id}`} numeric>
            <IconButton
              icon="tooltip-edit"
              mode="contained"
              iconColor={theme.colors.primary}
              size={20}
              onPress={() => {
                _onRowClick(
                  item.id,
                  item.title,
                  item.descriptions
                );
                setIsUpdateDialogVisible(true);
                setresponseError("");
              }}
            />
          </DataTable.Cell>
        </DataTable.Row>
      </>
    );
  };

  const [uid, setuid] = React.useState("");
  const [utitle, setutitle] = React.useState("");
  const [udescriptions, setudescriptions] = React.useState("");

  const _onRowClick = (id, title, descriptions) => {
    setuid(id);
    setutitle(title);
    setudescriptions(descriptions);
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: theme.colors.primary,
        }}
      />
    );
  };

  const getItem = (item) => {
    // Function for click on an item
    alert("Id : " + item.id + " Title : " + item.title);
  };

  const _onAddCategoryPress = async () => {
    if (title != "" && descriptions != "") {
      let payload = {
          'title': title,
          'descriptions': descriptions,
      };
      var data = await AsyncStorage.getItem("@jwt:token");
      var data = JSON.parse(data);
      // cleartoken();
      axios
        .post(API + "/categories", payload, {
          headers: {
            Authorization: `Bearer ${data}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.id) {
            settitle("");
            setdescriptions("");
            setresponseError("Category Added Successfully!");
          }
          console.log(response.data.id);
        })
        .catch((error) => {
          // console.log(error.response.data.error.message);
          setresponseError("Check Fields");
        });
    } else {
      setresponseError("Please fill data");
    }
  };
  const _GetCategories = async () => {
    var data = await AsyncStorage.getItem("@jwt:token");
    var data = JSON.parse(data);
    // cleartoken();
    axios
      .get(API + "/categories", {
        headers: {
          Authorization: `Bearer ${data}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        setFilteredDataSource(response.data);
        setMasterDataSource(response.data);
      })
      .catch((error) => {
        // console.log(error.response.data.error.message);
        setresponseError("Check Fields");
      });
  };

  const _onUpdateCategoryPress = async () => {
    if (utitle != "" && udescriptions != "" && uid != "") {
      let payload = {
          'title': utitle,
          'descriptions': udescriptions,
      };
      var data = await AsyncStorage.getItem("@jwt:token");
      var data = JSON.parse(data);
      // cleartoken();
      axios
        .put(API + "/categories/" + uid, payload, {
          headers: {
            Authorization: `Bearer ${data}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.id) {
            setresponseError("Category Updated Successfully!");
          }
          console.log(response.data.id);
        })
        .catch((error) => {
          // console.log(error.response.data.error.message);
          setresponseError("Check Fields");
        });
    } else {
      setresponseError("Please fill data");
    }
  };
  const _onDeleteCategoryPress = async () => {
    if (uid != "") {
      // let payload = {
      //   data: {
      //     title: utitle,
      //     descriptions: udescriptions,
      //   },
      // };
      var data = await AsyncStorage.getItem("@jwt:token");
      var data = JSON.parse(data);
      // cleartoken();
      axios
        .delete(API + "/categories/" + uid, {
          headers: {
            Authorization: `Bearer ${data}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.id) {
            setresponseError("Category Deleted Successfully!");
          }
          console.log(response.data.id);
        })
        .catch((error) => {
          // console.log(error.response.data.error.message);
          setresponseError("Check Fields");
        });
    } else {
      setresponseError("Please fill data");
    }
  };

  useEffect(() => {
    Promise.all(_GetCategories());
  }, [responseError]);

  return (
    <>
      <View style={{ marginTop: 25 }}></View>
      {/* <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        /> */}
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
      <Provider>
        <View>
          <Button
            buttonColor={theme.colors.onPrimary}
            icon="content-save"
            textColor={theme.colors.primary}
            mode="contained"
            style={{ marginTop: 10 }}
            onPress={() => {
              setIsDialogVisible(true);
              setresponseError("");
            }}
          >
            Add Category
          </Button>
          <Portal>
            <Dialog
              visible={isDialogVisible}
              onDismiss={() => {
                setIsDialogVisible(false);
                setresponseError("");
              }}
            >
              <Dialog.Title>Add Category</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Title"
                  placeholder="abc"
                  mode="outlined"
                  value={title}
                  onChangeText={(e) => {
                    settitle(e);
                    setresponseError("");
                  }}
                />
                <TextInput
                  label="Description"
                  placeholder="abc"
                  mode="outlined"
                  value={descriptions}
                  onChangeText={(e) => {
                    setdescriptions(e);
                    setresponseError("");
                  }}
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
                    icon="content-save"
                    textColor={theme.colors.onPrimary}
                    mode="contained"
                    onPress={_onAddCategoryPress}
                  >
                    Add Category
                  </Button>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    setIsDialogVisible(false);
                    setresponseError("");
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
            {/* <_DialogAddCatrgory /> */}
            <Dialog
              visible={isUpdateDialogVisible}
              onDismiss={() => {
                _onRowClick("", "", "");
                setIsUpdateDialogVisible(false);
                setresponseError("");
              }}
            >
              <Dialog.Title>Edit Category</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Title"
                  placeholder="abc"
                  mode="outlined"
                  value={utitle}
                  onChangeText={(e) => {
                    setutitle(e);
                    setresponseError("");
                  }}
                />
                <TextInput
                  label="Description"
                  placeholder="abc"
                  mode="outlined"
                  value={udescriptions}
                  onChangeText={(e) => {
                    setudescriptions(e);
                    setresponseError("");
                  }}
                />
                <View>
                  <Text
                    variant="labelSmall"
                    style={{ textAlign: "left", color: theme.colors.primary }}
                  >
                    {responseError}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    style={{ width: "40%" }}
                    buttonColor={theme.colors.primary}
                    icon="update"
                    textColor={theme.colors.onPrimary}
                    mode="contained"
                    onPress={_onUpdateCategoryPress}
                  >
                    Update Category
                  </Button>
                  <Button
                    style={{ marginStart: "20%", width: "40%" }}
                    buttonColor={theme.colors.primary}
                    icon="delete"
                    textColor={theme.colors.onPrimary}
                    mode="contained"
                    onPress={_onDeleteCategoryPress}
                  >
                    Delete Category
                  </Button>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    _onRowClick("", "", "");
                    setIsUpdateDialogVisible(false);
                    setresponseError("");
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
            {/* <_DialogEditCatrgory /> */}
          </Portal>
        </View>

        <DataTable key="DT1" style={{ marginTop: 10 }}>
          <DataTable.Header>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title numeric>Description</DataTable.Title>
            <DataTable.Title numeric>Options</DataTable.Title>
          </DataTable.Header>

          <FlatList
            data={filteredDataSource}
            overflow={"hidden"}
            style={{ overflow: "hidden" }}
            keyExtractor={(item) => item.toString()}
            // ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          />
        </DataTable>
      </Provider>
    </>
  );
};

const FeedsRoute = ({ navigation }) => {
  const theme = useTheme();

  const [search, setSearch] = useState("");
  const ref = React.useRef(null);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const [title, settitle] = React.useState("");
  const [descriptions, setdescriptions] = React.useState("");
  const [content, setcontent] = React.useState("");
  const [category, setcategory] = React.useState("");
  const [media, setmedia] = React.useState("");

  const [news_image, setNews_Image] = React.useState("");
  const [news_video, setNews_Video] = React.useState("");

  const [categoriesData, setCategoriesData] = React.useState([]);
  const [responseError, setresponseError] = React.useState("");

  //diaglog add
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  //Show DropDown

  //diaglog update
  const [isUpdateDialogVisible, setIsUpdateDialogVisible] = useState(false);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
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
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };
  async function _getCategoriesResponse() {
    axios
      .get(API + "/categories")
      .then((response) => {
        // console.log(JSON.stringify(response.data.data));
        // const suggestions = items.map((item) => ({
        //   id: item.id,
        //   title: item.attributes.title,
        // }));setCategoriesData(suggestions);
        const items = response.data;
        setCategoriesData(response.data);
        const temp_categories = [];
        items.map((item) => {
          temp_categories.splice(0, 0, {
            id: item.id,
            title: item.title,
          });
          // console.log(temp_categories);
        });
        setCategoriesData(temp_categories);
      })
      .catch((err) => console.log("error " + err));
  }

  async function _onAddNewsFeed() {
    if (
      title != "" 
      // && descriptions != "" 
      // && content != "" 
      // && category != "" 
      // && news_image != "" 
      // && news_video != ""
    ) {
      console.log(category);
      let payload = {
          'title': title,
          'descriptions': descriptions,
          'content': content,
          'category': category
      };

      var data = await AsyncStorage.getItem("@jwt:token");
      var data = JSON.parse(data);
      var now = new Date().toDateString();
      // now = moment().format("MMMM Do YYYY, h:mm:ss a");
      // Y-m-d\TG:i:s.Y\Z
      now = moment().format("MMMM Do YYYY, h:mm:ss a");
      // console.log(now);
      axios
        .post(API + "/news-with-medias", payload, {
          headers: {
            Authorization: `Bearer ${data}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // console.log(response.data.id);
          if (response.data.id) {
            console.log(response.data.id);
            settitle("");
            setdescriptions("");
            setcontent("");
            // setcategory("");
            setresponseError("News Feed Added Successfully!");
            useUploadNewsImage(
              news_image.uri,
              news_image.name,
              news_image.mimeType,
              response.data.id
            );
            useUploadNewsVideo(
              news_video.uri,
              news_video.name,
              news_video.mimeType,
              response.data.id
            );
          }
        })
        .catch((error) => {
          console.log(error.data);
          setresponseError("Check Fields");
        });
    } else {
      // console.log(news_image,news_video);
      setresponseError("Please fill data");
    }
  }

  const _GetNewsFeed = async () => {
    var data = await AsyncStorage.getItem("@jwt:token");
    var data = JSON.parse(data);
    // cleartoken();
    axios
      .get(API + "/news-with-medias", {
        headers: {
          Authorization: `Bearer ${data}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(JSON.stringify(response.data.data));
        setFilteredDataSource(response.data);
        setMasterDataSource(response.data);
      })
      .catch((error) => {
        console.log(error?.response?.data?.error?.message);
        setresponseError("Check Fields");
      });
  };
  const ItemView = ({ item }) => {
    // console.log(CategoryData);
    return (
      // Flat List Item
      <>
        {/* <Text
          style={{ marginTop: 10, marginBottom: 10, position: "relative" }}
          onPress={() => getItem(item)}
        >
          {item.id}
          {"."}
          {item.attributes.title.toUpperCase()}
        </Text> */}
        <DataTable.Row
           key={`rown-${item?.id}`}
          onPress={() => {
            _onRowClick(
              item.id,
              item.title,
              item.descriptions,
              item.content,
              item?.category?.id
            );
            setIsUpdateDialogVisible(true);
            setresponseError("");
          }}
        >
          <DataTable.Cell>{item?.title.toUpperCase()}</DataTable.Cell>
          <DataTable.Cell numeric>
            {item?.category?.title?.toUpperCase()}
          </DataTable.Cell>
          <DataTable.Cell numeric>
            <IconButton
              icon="tooltip-edit"
              mode="contained"
              iconColor={theme.colors.primary}
              size={20}
              onPress={() => {
                _onRowClick(
                  item.id,
                  item.title,
                  item.descriptions,
                  item.content,
                  item?.category?.id
                );
                setIsUpdateDialogVisible(true);
                setresponseError("");
              }}
            />
          </DataTable.Cell>
        </DataTable.Row>
      </>
    );
  };

  const [uid, setuid] = React.useState("");
  const [utitle, setutitle] = React.useState("");
  const [udescriptions, setudescriptions] = React.useState("");
  const [ucontent, setucontent] = React.useState("");
  const [ucategory, setucategory] = React.useState("");

  const _onRowClick = (id, title, descriptions, content, category) => {
    setuid(id);
    setutitle(title);
    setudescriptions(descriptions);
    setucontent(content);
    setucategory(category);
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: theme.colors.primary,
        }}
      />
    );
  };

  const getItem = (item) => {
    // Function for click on an item
    alert("Id : " + item.id + " Title : " + item.title);
  };

  const _onUpdateFeedPress = async () => {
    if (utitle != "" && udescriptions != "" && uid != "" && ucontent != "" && ucategory != "") {
      let payload = {
          'title': utitle,
          'descriptions': udescriptions,
          'content': ucontent,
          'category': ucategory,
      };
      var data = await AsyncStorage.getItem("@jwt:token");
      var data = JSON.parse(data);
      // cleartoken();
      axios
        .put(API + "/news-with-medias/" + uid, payload, {
          headers: {
            Authorization: `Bearer ${data}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.id) {
            setresponseError("Feed Updated Successfully!");
          }
          console.log(response.data.id);
        })
        .catch((error) => {
          // console.log(error.response.data.error.message);
          setresponseError("Check Fields");
        });
    } else {
      setresponseError("Please fill data");
    }
  };
  const _onDeleteFeedPress = async () => {
    if (uid != "") {
      // let payload = {
      //   data: {
      //     title: utitle,
      //     descriptions: udescriptions,
      //   },
      // };
      var data = await AsyncStorage.getItem("@jwt:token");
      var data = JSON.parse(data);
      // cleartoken();
      axios
        .delete(API + "/news-with-medias/" + uid, {
          headers: {
            Authorization: `Bearer ${data}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.id) {
            setresponseError("Feed Deleted Successfully!");
          }
          console.log(response.data.id);
        })
        .catch((error) => {
          // console.log(error.response.data.error.message);
          setresponseError("Check Fields");
        });
    } else {
      setresponseError("Please fill data");
    }
  };

  useEffect(() => {
    // console.log(JSON.parse(jwtAuth));
    Promise.all(_getCategoriesResponse(), _GetNewsFeed())
      .then((response) => {
        // console.log(response);
      })
      .catch((err) => console.log("error " + err));
    // var now = new Date().toDateString();
    // now = moment().format("MMMM Do YYYY, h:mm:ss a");
    // Y-m-d\TG:i:s.Y\Z
    // now = moment().format("Y-m-dTG:i:s.YZ");
    // console.log(now);
  }, [responseError]);
  return (
    <>
      <View style={{ marginTop: 25 }}></View>
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

      <Provider>
        <View>
          <Button
            buttonColor={theme.colors.onPrimary}
            icon="content-save"
            textColor={theme.colors.primary}
            mode="contained"
            style={{ marginTop: 10 }}
            onPress={() => {
              setIsDialogVisible(true);
              setresponseError("");
            }}
          >
            Add News Feed
          </Button>
        </View>
        <Portal>
          <Dialog
            visible={isDialogVisible}
            onDismiss={() => {
              setIsDialogVisible(false);
              setresponseError("");
            }}
          >
            <Dialog.Title>Add Feed</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Title"
                placeholder="abc"
                mode="outlined"
                value={title}
                onChangeText={(e) => {
                  settitle(e);
                  setresponseError("");
                }}
              />
              <TextInput
                label="Description"
                placeholder="abc"
                mode="outlined"
                value={descriptions}
                onChangeText={(e) => {
                  setdescriptions(e);
                  setresponseError("");
                }}
              />
              <TextInput
                label="Content"
                placeholder="abc"
                mode="outlined"
                value={content}
                multiline={true}
                numberOfLines={5}
                onChangeText={(e) => {
                  setcontent(e);
                  setresponseError("");
                }}
              />
              <AutocompleteDropdown
                clearOnFocus={false}
                closeOnBlur={true}
                closeOnSubmit={false}
                // initialValue={{ id: "2" }} // or just '2'
                onSelectItem={(item) => {
                  setcategory(item?.id);
                  console.log(item?.id);
                }}
                useFilter={true}
                initialValue={{ucategory}}
                dataSet={categoriesData}
                // useFilter={false} // set false to prevent rerender twice
                textInputProps={{
                  placeholder: "Select Category",
                  placeholderTextColor: theme.colors.shadow,
                  autoCorrect: true,
                  autoCapitalize: "none",
                  style: {
                    // borderRadius: 25,
                    borderColor: theme.colors.shadow,
                    backgroundColor: theme.colors.onPrimary,
                    color: theme.colors.shadow,
                    paddingLeft: 18,
                  },
                }}
                rightButtonsContainerStyle={{
                  right: 8,
                  height: 30,

                  alignSelf: "center",
                }}
                inputContainerStyle={{
                  backgroundColor: theme.colors.onPrimary,
                  color: theme.colors.shadow,
                  // borderRadius: 25,
                }}
                suggestionsListContainerStyle={{
                  backgroundColor: theme.colors.onPrimary,
                  color: theme.colors.shadow,
                }}
                containerStyle={{ flexGrow: 1, flexShrink: 1, marginTop: 10 }}
                renderItem={(item) => (
                  <Text
                    style={{
                      backgroundColor: theme.colors.onPrimary,
                      color: theme.colors.shadow,
                      padding: 15,
                    }}
                  >
                    {item.title}
                  </Text>
                )}
              />
              <Button
                buttonColor={theme.colors.onPrimary}
                icon="file-image-plus"
                textColor={theme.colors.primary}
                mode="contained"
                style={{
                  marginTop: 10,
                  padding: 10,
                }}
                // onPress={pickImage}
                onPress={async () => {
                  let result = await DocumentPicker.getDocumentAsync({
                    type: "image/*",
                  });

                  // alert(result.uri);
                  console.log(result);
                  if (result.type != "cancel") {
                    
                    setNews_Image(result);
                    // useUploadNewsImage(news_image.uri,news_image.name,news_image.mimeType,35)
                  }
                }}
              >
                Select Image
              </Button>

              <Button
                buttonColor={theme.colors.onPrimary}
                icon="video-plus"
                textColor={theme.colors.primary}
                mode="contained"
                style={{
                  marginTop: 10,
                  padding: 10,
                }}
                // onPress={pickVideo}
                onPress={async () => {
                  let result = await DocumentPicker.getDocumentAsync({
                    type: "video/*",
                  });
                  // alert(result.uri);
                  console.log(result);
                  if (result.type != "cancel") {
                    setNews_Video(result);
                  }
                  // useUploadNewsVideo(
                  //   news_video.uri,
                  //   news_video.name,
                  //   news_video.mimeType,
                  //   35
                  // );
                  // console.log(await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem?.EncodingType?.Base64 }));
                }}
              >
                Select Video
              </Button>

              {/* {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200 }}
                />
              )} */}

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
                  icon="content-save"
                  textColor={theme.colors.onPrimary}
                  mode="contained"
                  onPress={_onAddNewsFeed}
                >
                  Add Feed
                </Button>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setIsDialogVisible(false);
                  setresponseError("");
                }}
              >
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
          {/* ADD NEWS */}
           {/* <_DialoguPDATEFeed /> */}
           <Dialog
              visible={isUpdateDialogVisible}
              onDismiss={() => {
                _onRowClick("", "", "");
                setIsUpdateDialogVisible(false);
                setresponseError("");
              }}
            >
              <Dialog.Title>Edit Feed</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Title"
                  placeholder="abc"
                  mode="outlined"
                  value={utitle}
                  onChangeText={(e) => {
                    setutitle(e);
                    setresponseError("");
                  }}
                />
                <TextInput
                  label="Description"
                  placeholder="abc"
                  mode="outlined"
                  value={udescriptions}
                  onChangeText={(e) => {
                    setudescriptions(e);
                    setresponseError("");
                  }}
                />
                 <TextInput
                label="Content"
                placeholder="abc"
                mode="outlined"
                value={ucontent}
                multiline={true}
                numberOfLines={5}
                onChangeText={(e) => {
                  setucontent(e);
                  setresponseError("");
                }}
              />
                <AutocompleteDropdown
                clearOnFocus={false}
                closeOnBlur={true}
                closeOnSubmit={false}
                initialValue={{ id: ucategory }} 
                onSelectItem={(item) => {
                  setucategory(item?.id);
                  setresponseError("");
                  console.log(item?.id);
                }}
                dataSet={categoriesData}
                // useFilter={false} // set false to prevent rerender twice
                textInputProps={{
                  placeholder: "Select Category",
                  placeholderTextColor: theme.colors.shadow,
                  autoCorrect: false,
                  autoCapitalize: "none",
                  style: {
                    // borderRadius: 25,
                    borderColor: theme.colors.shadow,
                    backgroundColor: theme.colors.onPrimary,
                    color: theme.colors.shadow,
                    paddingLeft: 18,
                  },
                }}
                rightButtonsContainerStyle={{
                  right: 8,
                  height: 30,

                  alignSelf: "center",
                }}
                inputContainerStyle={{
                  backgroundColor: theme.colors.onPrimary,
                  color: theme.colors.shadow,
                  // borderRadius: 25,
                }}
                suggestionsListContainerStyle={{
                  backgroundColor: theme.colors.onPrimary,
                  color: theme.colors.shadow,
                }}
                containerStyle={{ flexGrow: 1, flexShrink: 1, marginTop: 10 }}
                renderItem={(item) => (
                  <Text
                    style={{
                      backgroundColor: theme.colors.onPrimary,
                      color: theme.colors.shadow,
                      padding: 15,
                    }}
                  >
                    {item.title}
                  </Text>
                )}
              />
                <View>
                  <Text
                    variant="labelSmall"
                    style={{ textAlign: "left", color: theme.colors.primary }}
                  >
                    {responseError}
                  </Text>
                </View>
                
                <View style={{ flexDirection: "row" }}>
                  <Button
                    style={{ width: "40%" }}
                    buttonColor={theme.colors.primary}
                    icon="update"
                    textColor={theme.colors.onPrimary}
                    mode="contained"
                    onPress={_onUpdateFeedPress}
                  >
                    Update Feed
                  </Button>
                  <Button
                    style={{ marginStart: "20%", width: "40%" }}
                    buttonColor={theme.colors.primary}
                    icon="delete"
                    textColor={theme.colors.onPrimary}
                    mode="contained"
                    onPress={_onDeleteFeedPress}
                  >
                    Delete Feed
                  </Button>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    _onRowClick("", "", "");
                    setIsUpdateDialogVisible(false);
                    setresponseError("");
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
            {/* <_DialoguPDATEFeed /> */}
        </Portal>
        <DataTable style={{ marginTop: 10 }}>
          <DataTable.Header>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title numeric>Category</DataTable.Title>
            <DataTable.Title numeric>Options</DataTable.Title>
          </DataTable.Header>

          <FlatList
            data={filteredDataSource}
            overflow={"hidden"}
            style={{ overflow: "hidden" }}
            keyExtractor={(id, attributes) => attributes.toString()}
            // ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          />
        </DataTable>
      </Provider>
    </>
  );
};

const SettingsRoute = ({ navigation }) => (
  <View style={{ marginTop: 25 }}>
    <Text>Users</Text>
  </View>
);

const Tab = createBottomTabNavigator();

function MyTabs() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "DashboardAuth") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Categories") {
            iconName = focused ? "ios-newspaper" : "ios-newspaper-outline";
          } else if (route.name === "Feeds") {
            iconName = focused ? "ios-albums" : "ios-albums-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        options={{ title: "Dashboard", headerShown: false }}
        name="DashboardAuth"
        component={DashboardRoute}
      />
      <Tab.Screen
        options={{ title: "Categories", headerShown: false }}
        name="Categories"
        component={CategoriesRoute}
      />
      <Tab.Screen
        options={{ title: "Feeds", headerShown: false }}
        name="Feeds"
        component={FeedsRoute}
      />
      {/* <Tab.Screen
        options={{ title: "Users", headerShown: false }}
        name="Settings"
        component={SettingsRoute}
      /> */}
    </Tab.Navigator>
  );
}

export default function DashboardScreen({ navigation }) {
  return <MyTabs />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  logo: {
    height: 128,
    width: 128,
  },
});
