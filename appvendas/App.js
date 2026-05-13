import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import {useNavigation} from '@react-navigation/native';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from "./Login";
import Home from "./Home";
import NewAccount from "./NewAccount";

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        headerShown: false
      }
    },
    Login: {
      screen: Login,
    },
    NewAccount: {
      screen: NewAccount, 
    }
  },
});

const Navigation = createStaticNavigation(RootStack);

const { width } = Dimensions.get("window");

export default function App() {return <Navigation/> }


