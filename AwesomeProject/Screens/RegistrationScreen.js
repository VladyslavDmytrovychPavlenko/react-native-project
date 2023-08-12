import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import * as ImagePicker from 'expo-image-picker';

import {
  StyleSheet,
  View,
  Text,
  ImageBackground,  
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from "react-native";

import { Feather } from '@expo/vector-icons';

import { authSignUpUser } from "../redux/auth/authOpration";
import { nanoid } from "@reduxjs/toolkit";
import { storage, } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function RegistrationScreen() {

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  
  const [isFocusedLogin, setIsFocusedLogin] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  useEffect(() => {
    (async () => {
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      setHasGalleryPermission(gallery.status === "granted");
    })();
  }, []);  

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const pickAvatar =  async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    
    if (!result.canceled) {
      delete result.cancelled;
      return result.assets[0].uri;
    };
  };

  const uploadAvatarToServer = async () => {
    let avatarUrl = await pickAvatar();
    
    const response = await fetch(avatarUrl);
    const file = await response.blob();
    const uniqueAvatarId = nanoid();
    setAvatarId(uniqueAvatarId)
    const storageRef = ref(storage, `avatarImage/${uniqueAvatarId}`);

    await uploadBytes(storageRef, file);
    await getDownloadURL(storageRef).then((url) => {
      avatarUrl = url;
    });
    
    setAvatar(avatarUrl)
  };

  const deleteAvatarfromServer = async () => {    
    const storageRef = ref(storage, `avatarImage/${avatarId}`);
    await deleteObject(storageRef);
    setAvatar(null);    
  }

  const clearAvatar = () => {
    setAvatar(null);
  }
  
  const onSubmit = () => {
    
    setLogin("");
    setEmail("");
    setPassword("");
    Keyboard.dismiss();    
    dispatch(authSignUpUser({ email, password, login, avatar, avatarId }));
  };

  if (hasGalleryPermission === null) { return <View /> };
  if (hasGalleryPermission === false) { return <Text>Permission to access the gallery was denied</Text> };
  
  return (
    <View style={styles.container}>
      {/* background */}
      <ImageBackground
        source={require("../assets/images/image-bg.jpg")}
        style={styles.imageBackground}
      >
          
        <View style={styles.wrapper}>

          <View style={styles.avatar}>
            
            <View style={{
              borderRadius: 16,
              overflow: "hidden"
            }}>

            {avatar && <Image source={{ uri: avatar }}
              style={{
                height: "100%",
                width: "100%",
                resizeMode: "cover"
              }} />}
            </View>
            <TouchableHighlight
              style={styles.avatarBtn}
              activeOpacity={0.8}
              underlayColor="#ffffff"
              onPress={!avatar ? uploadAvatarToServer : deleteAvatarfromServer}
            >
              {avatar
                ? <Feather name="x-circle" size={25} color="#BDBDBD" />
                : <Feather name="plus-circle" size={25} color="#FF6C00" />
              }
            </TouchableHighlight>
          </View>
           
          <View>
            <Text style={styles.formTitle}>Реєстрація</Text>
          </View>
          {/* form */}
          <View style={styles.form}>
            <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : 'height'}
            >
              {/* input login */}
              <View>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: isFocusedLogin ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: isFocusedLogin ? '#FFFFFF' : "#F6F6F6",
                    color: "#212121",
                  }}
                  placeholder='Логін'
                  onFocus={() => setIsFocusedLogin(true)}
                  onBlur={() => setIsFocusedLogin(false)}
                  value={login}
                  onChangeText={setLogin}
                />
              </View>
              {/* input email */}
              <View>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: isFocusedEmail ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: isFocusedEmail ? '#FFFFFF' : "#F6F6F6",
                    color: "#212121",
                  }}
                  placeholder="Адреса електронної пошти"
                  onFocus={() => setIsFocusedEmail(true)}
                  onBlur={() => setIsFocusedEmail(false)}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              {/* input password */}
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: isFocusedPassword ? "#FF6C00" : "#E8E8E8",
                    backgroundColor: isFocusedPassword ? "#FFFFFF" : "#F6F6F6",
                    color: "#212121",
                  }}
                  placeholder='Пароль'
                  secureTextEntry={!isVisiblePassword}
                  onFocus={() => setIsFocusedPassword(true)}
                  onBlur={() => setIsFocusedPassword(false)}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.btnToggle}
                  activeOpacity={0.8}
                  onPressIn={() => setIsVisiblePassword(true)}
                  onPressOut={() => setIsVisiblePassword(false)}
                >
                  <Text style={styles.btnToggleText}>Показати</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            {/* btn sign up */}
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={0.8}
              onPress={onSubmit}
            >
              <Text style={styles.btnTitle}>Зареєструватись</Text>
            </TouchableOpacity>
            {/* link */}
            <TouchableOpacity
              style={styles.link}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.linkText}>
                Вже є акаунт? Увійти
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({

   container: {
    flex: 1,
    backgroundColor: '#ffffff',   
  },

  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  wrapper: {
    position: "relative",    
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#ffffff"
  },

  avatar: {
    position: "relative",
    top: 0,
    left: '50%',
    width: 120,
    height: 120,
    marginLeft: -60,
    marginTop: -60,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    
  },

  avatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 25,
    height: 25,
    marginBottom: 12.5,
    marginRight: -12.5,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",  
  },

  formTitle: {
    marginTop: 32,
    marginBottom: 33,
    fontSize: 30,
    fontFamily: "Roboto-Medium",
    fontWeight: 500,
    lineHeight: 35,
    letterSpacing: 0.01,
    textAlign: "center",
    color: "#212121",  
  },

  form: {
    paddingHorizontal: 16,
  },

  input: {
    padding: 16,
    marginBottom: 16,    
    textAlign: 'left',
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#BDBDBD",
    borderWidth: 1,   
    borderRadius: 8,
  },

   btnToggle: {
    position: "absolute",
    top: 20,
    right: 16,   
  },

  btnToggleText: {
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },

  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 43,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FF6C00',
    borderRadius: 25,
  },

  btnTitle: {
    fontFamily: 'Roboto-Regular',
    fontWeight: 400,
    color: '#ffffff',
  },

  link: {
    alignItems: "center",
    marginBottom: 45,
  },

  linkText: {
    fontFamily: 'Roboto-Regular',
    fontWeight: 400,
    fontSize: 16,
    color: "#1B4371",
  },
});
