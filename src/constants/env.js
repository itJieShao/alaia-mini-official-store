const ENV = "uat";

const HOST = {
  sit: "https://tasaki-backend-uat.baozun.com",
  uat: "https://tasaki-backend-uat.baozun.com",
  prod: "https://tasaki-backend.baozun.com"
};

const GA = {
  uat: "UA-191443309-1",
  prod: "UA-191443309-1"
};

export const WECHAT_TRACK_URL = "https://tasaki-backend.baozun.com/wechat/market/userActionAdd";

export const CURRENT_HOST = HOST[ENV];

export const CURRENT_API = `${HOST[ENV]}/graphql`;

export const CURRENT_ENV = ENV;

export const CURRENT_GA = GA[ENV];

export const TITLE = "TASAKI";
