import dotenv from "dotenv";
import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/firestore";
dotenv.config();
const {
  REACT_APP_apiKey: apiKey,
  REACT_APP_VapidKey: VapidKey,
  REACT_APP_authDomain: authDomain,
  REACT_APP_databaseURL: databaseURL,
  REACT_APP_projectId: projectId,
  REACT_APP_storageBucket: storageBucket,
  REACT_APP_messagingSenderId: messagingSenderId,
  REACT_APP_appId: appId
} = process.env;
const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};
firebase.initializeApp(firebaseConfig);
export const messaging = firebase.messaging();
const db = firebase.firestore();
export const Timers = db.collection("timers");
messaging.usePublicVapidKey(VapidKey || "");
let token: string | null = null;
export const getToken = () => token;
messaging.onTokenRefresh(async () => {
  token = await messaging.getToken();
});
messaging.getToken().then(val => {
  token = val;
});

messaging
  .requestPermission()
  .then(function() {
    console.log("Notification permission granted.");
  })
  .catch(function(err) {
    console.log("Unable to get permission to notify.", err);
  });

export const addTimer = async (
  title: string,
  body: string,
  remaining: number,
  token: string
) => {
  const { id } = await Timers.add({
    title,
    body,
    remaining,
    token,
    icon: "/tomato.png",
    click_action: window.location.href
  });
  return id;
};
export const delTimer = (id: string) => {
  Timers.doc(id).delete();
};
