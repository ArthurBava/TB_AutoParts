import React, { useEffect, useRef, useState } from "react";
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



export default function Login() {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0.7)).current;

    //Guardar Login e senha 
    const [Login, setLogin] = useState("");
    const [Senha, setSenha] = useState("");



    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim,{
                toValue: 1,
                duraction: 900,
                useNativeDriver: true,
            })
        ])

        Animated.timing(slideAnim, {
            toValue: 1,
            duraction: 700,
            useNativeDriver: true,
        })

        Animated.spring(logoScale, {
            toValue: 1,
            friction: 5,
            tension: 80,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLogin = ()  => {
        console.log
    }









}