import React, { useEffect, useState } from "react";

const API = {
  url: "http://192.168.1.138",
  port: '1337',
}

export default API.url+':'+API.port;