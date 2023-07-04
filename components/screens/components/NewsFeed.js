import React from "react";
import { View, StyleSheet, Image, ScrollView, FlatList } from "react-native";
import { useEffect, useState } from "react";

import { Button, Card, Paragraph, Divider } from "react-native-paper";
import API from "../../api/APIKit";
import { Dialog, Portal, PaperProvider } from "react-native-paper";
import { Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// import {SharedElement} from 'react-navigation-shared-element';

import moment from "moment";
import { useNavigation } from "@react-navigation/native";
export const NewsFeed = (props) => {
  const navigation = useNavigation();
  const [NewsFeedData, setNewsFeedData] = React.useState([]);
  // const [NewsFeedImageData, setNewsFeedImageData] = React.useState([]);

  useEffect(() => {
    console.log(props.data);
    setNewsFeedData(props.data);
    // console.log(props.data.title);
  }, [props.data]);

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

  // const CardCover = (props) => {
  //   setNewsFeedImageData(props.imageData);
  //   console.log(NewsFeedImageData?.attributes?.formats?.small?.url);

  //   return (
  //     <>
  //       <Card.Cover
  //         source={{
  //           // uri: "https://international.lgu.edu.pk/wp-content/uploads/2021/08/cropped-logo-1-453x172.png",
  //           uri: API + `${NewsFeedImageData?.attributes?.formats?.small?.url}`,
  //         }}
  //       />
  //     </>
  //   );
  // };

  const TextLimit = ({ text }) => {
    const words = text.split(" ");
    const limitedWords = words.slice(0, 19).join(" ");

    return (
      <>
        <Text>{limitedWords}</Text>
        {words.length > 19 && <Text>{".... Read More"}</Text>}
      </>
    );
  };
  // const CardPress = (id) => {
  //   alert("Comming Soon! ID:"+id);
  // };
  const [visible, setVisible] = React.useState(false);

  const [uId, setuId] = React.useState(null);
  const [uTitle, setuTitle] = React.useState(null);
  const [uDescriptions, setuDescriptions] = React.useState(null);
  const [uContent, setuContent] = React.useState(null);
  const [uCategory, setuCategory] = React.useState(null);
  const [uImage, setuImage] = React.useState(null);
  const [uVideo, setuVideo] = React.useState(null);
  const [uDate, setuDate] = React.useState(null);

  const [singleNewsFeed, setSingleNewsFeed] = React.useState(false);
  const showDialog = (
    id,
    title,
    descriptions,
    content,
    category,
    image,
    video,
    date
  ) => {
    setVisible(true);
    setuId(id);
    setuTitle(title);
    setuDescriptions(descriptions);
    setuContent(content);
    setuCategory(category);
    setuImage(image);
    setuVideo(video);
    setuDate(date);
    console.log(id);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  return (
    <>
      <ScrollView
        vertical={true}
        showsverticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        <Portal>
          <Dialog visible={visible} style={{height:"90%"}} onDismiss={hideDialog}>
            <Dialog.Title>
              {uTitle}
            </Dialog.Title>
            <ScrollView >
            <Dialog.Content>
            <View >
            <Card.Cover
              resizeMode={`cover`}
              source={{
                //  uri: "https://international.lgu.edu.pk/wp-content/uploads/2021/08/cropped-logo-1-453x172.png",
                uri: API + `${uImage}`,
              }}
            />
              </View>
            </Dialog.Content>
            <Dialog.Content>
            <Text variant="bodyMedium">{uDescriptions}</Text>
            <Text variant="bodyMedium">{uContent}</Text>
              <Divider></Divider>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bodySmall}>{uCategory}</Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12,
                    lineHeight: 25,
                    color: "#9394B3",
                    textAlign: "right",
                  }}
                >
                  {uDate}
                </Text>
                
              </View>
           
            </Dialog.Content>
            </ScrollView>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        {/* <Button onPress={showDialog}>Show Dialog</Button> */}
        {NewsFeedData?.map((item) => (
          <Card
            key={`newsfeedv-${item.id}`}
            onPress={() =>
              showDialog(
                item.id,
                item.title,
                item.descriptions,
                item.content,
                item.category.title,
                item?.image?.formats?.small?.url,
                item?.video?.url,
                moment(item?.createdAt).format("MMMM Do YYYY")
              )
            }
          >
            {/* <CardCover imageData={attributes?.image?.data} /> */}
            <Card.Cover
              resizeMode={`cover`}
              source={{
                //  uri: "https://international.lgu.edu.pk/wp-content/uploads/2021/08/cropped-logo-1-453x172.png",
                uri: API + `${item?.image?.formats?.small?.url}`,
              }}
            />
            <Card.Content>
              <Paragraph style={styles.headlineMedium}>{item?.title}</Paragraph>
              <Paragraph style={styles.bodyMedium}>
                <TextLimit text={item?.descriptions} />
              </Paragraph>

              <Divider></Divider>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.bodySmall}>{item?.category?.title}</Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12,
                    lineHeight: 25,
                    color: "#9394B3",
                    textAlign: "right",
                  }}
                >
                  {moment(item?.createdAt).format("MMMM Do YYYY")}
                </Text>
              </View>
            </Card.Content>
            {/* <Card.Actions>
        <Button
          style={{ marginLeft: 10 }}
          mode="elevated"
          onPress={() => console.log(`id: ${id}`)}
        >
          Like
        </Button>
      </Card.Actions> */}
          </Card>
        ))}
      </ScrollView>
    </>
  );
};
