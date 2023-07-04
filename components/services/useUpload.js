import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api/APIKit";

export const useUploadNewsImage = async (uri, name, type, refId) => {
  let apiUrl = API + "/upload/";
  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append("files", {
    uri,
    name: `${name}.${fileType}`,
    type: `${type}`,
    // type: `image/${fileType}`,
  });
  // formData.append('ref', 'api::new.new');
  // formData.append('refId', '35');
  // formData.append('field', 'image');
  formData.append("ref", "application::news-with-media.news-with-media");
  formData.append("refId", refId);
  formData.append("field", "image");

  console.log(formData);

  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    let responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.log('Error uploading image:', error);
  }
};




export const useUploadNewsVideo = async (uri, name, type, refId) => {
  let apiUrl = API + "/upload/";
  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append("files", {
    uri,
    name: `${name}.${fileType}`,
    type: `${type}`,
    // type: `image/${fileType}`,
  });
  // formData.append('ref', 'api::new.new');
  // formData.append('refId', '35');
  // formData.append('field', 'image');
  formData.append("ref", "application::news-with-media.news-with-media");
  formData.append("refId", refId);
  formData.append("field", "video");
  console.log(formData);
  try {
    let response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    let responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.log('Error uploading video:', error);
  }
};
