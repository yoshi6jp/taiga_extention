import dotenv from "dotenv";
import _ from "lodash";
import firebase from "firebase/app";
import "firebase/messaging";
import "firebase/firestore";
import { TimerMode } from "./timer";
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
let token: string | null = null;
navigator.serviceWorker
  .register("./firebase-messaging-sw.js")
  .then(registration => {
    if (!_.get(messaging, "registrationToUse")) {
      messaging.useServiceWorker(registration);
    }
    messaging.usePublicVapidKey(VapidKey || "");
    messaging.onTokenRefresh(async () => {
      token = await messaging.getToken();
    });
    messaging.getToken().then(val => {
      token = val;
    });
  });
const db = firebase.firestore();
export const Timers = db.collection("timers");
export const getToken = () => token;

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
  token: string,
  mode: TimerMode
) => {
  const { id } = await Timers.add({
    title,
    body,
    remaining,
    token,
    icon: "./tomato.png",
    click_action: window.location.href,
    mode
  });
  return id;
};
export const delTimer = (id: string) => {
  Timers.doc(id).delete();
};
