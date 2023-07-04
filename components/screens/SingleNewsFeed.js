import React from "react";
import { View, StyleSheet, Image, ScrollView, FlatList } from "react-native";
import { useEffect, useState } from "react";

import { Button, Card, Paragraph, Divider } from "react-native-paper";

import axios from "axios";
import useAsyncStorage from "../services/useAsyncStorage";
import API from "../api/APIKit";
import { useNavigation } from '@react-navigation/native';
export default function SingleNewFeed({ navigation, route }) {
  // const navigation = useNavigation(); 
  const [NewsSFeedData, setNewsSFeedData] = React.useState(null);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    video: {
      alignSelf: "center",
      width: 320,
      height: 200,
    },
    player: {
      flex: 1,
    }
  });
  // async function _getResponseNews(id) {
  //   axios
  //     .get(API + "/news-with-medias/"+id)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       setNewsSFeedData(response.data);
  //     })
  //     .catch((err) => console.log("error " + err));
  // }
  useEffect(() => {
    // console.log(JSON.parse(jwtAuth));
    // Promise.all(_getResponseNews(route.params.NewsFeedId))
    //   .then((response) => {
    //     // console.log(response);
    //   })
    //   .catch((err) => console.log("error " + err));
  }, []);

  return (
    <>
    <ScrollView
      vertical={true}
      showsverticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 130 }}
    >
      {NewsSFeedData?.map((item) => (
        <Card key={`newsfeedv-${item.id}`} onPress={()=>navigation.navigate("SingleNewsFeed", {NewsFeedId: item.id} )}>
          {/* <CardCover imageData={attributes?.image?.data} /> */}
          <Card.Cover resizeMode={`cover`}
            source={{
              //  uri: "https://international.lgu.edu.pk/wp-content/uploads/2021/08/cropped-logo-1-453x172.png",
              uri:
                API +
                `${item?.image?.formats?.small?.url}`,
            }}
          />
          <Card.Content>
            <Paragraph style={styles.headlineMedium}>
              {item?.title}
            </Paragraph>
            <Paragraph style={styles.bodyMedium}>
              {/* {attributes?.descriptions} */}
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
}
