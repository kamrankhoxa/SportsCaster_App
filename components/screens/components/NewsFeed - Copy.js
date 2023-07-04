import React from "react";
import { View, StyleSheet, Image, ScrollView, FlatList } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextInput, Searchbar } from "react-native-paper";
import {
  BottomNavigation,
  Text,
  Card,
  Title,
  Paragraph,
} from "react-native-paper";
import API from '../../api/APIKit';
import useAsyncStorage from "../../services/useAsyncStorage";

export const NewsFeed = (props) => {
  const [NewsFeedData, setNewsFeedData] = React.useState([]);
  const [NewsFeedImageData, setNewsFeedImageData] = React.useState([]);

  useEffect(() => {
    console.log(props.data);
    setNewsFeedData(props.data);
  }, [props.data]);

  const CardCover = (props) => {
    setNewsFeedImageData(props.imageData);
    console.log(NewsFeedImageData?.attributes?.formats?.small?.url);
   
    return (
      <>
        <Card.Cover
          source={{
            // uri: "https://international.lgu.edu.pk/wp-content/uploads/2021/08/cropped-logo-1-453x172.png",
            uri: API+`${NewsFeedImageData.attributes.formats.small.url}`,
          }}
        />
      </>
    );
  };
  return (
    <>
      <ScrollView
        vertical={true}
        showsverticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {NewsFeedData?.map(({ id, attributes }) => (
          <Card key={`newsfeed-${id}`}>
            {/* <>{console.log(attributes.image.data)}</> */}
            <CardCover imageData={attributes.image.data} />
            <Card.Content>
              <Paragraph>{attributes?.title}</Paragraph>
            </Card.Content>
            <Card.Actions>
              {/* <Button>Add To Favourites</Button> */}
              <Button
            style={{ marginLeft: 10 }}
            mode="elevated"
            onPress={() => console.log(`id: ${id}`)}
            >
              Like
          </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </>
  );
};
