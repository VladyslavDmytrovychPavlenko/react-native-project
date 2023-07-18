import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { RegistrationScreen } from "./Screens/RegistrationScreen";
import { LoginScreen } from "./Screens/LoginScreen.js";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);

  Keyboard.addListener("keyboardDidShow", () => {
    setKeyboardShown(true);
  });
  Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardShown(false);
  });

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={hideKeyboard}>
        <ImageBackground
          source={require("./assets/bg2x.jpg")}
          style={styles.bgImage}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* <LoginScreen keyboardShown={keyboardShown} /> */}
            <RegistrationScreen keyboardShown={keyboardShown} />
            <StatusBar style="auto" />
          </KeyboardAvoidingView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
});
