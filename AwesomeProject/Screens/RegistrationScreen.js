import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";

export const RegistrationScreen = ({ keyboardShown }) => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onRegSubmit = () => {
    Keyboard.dismiss();
    console.log(login, email, password);
    setLogin("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = (text) => {
    setLogin(text);
  };

  const handleEmail = (text) => {
    setEmail(text);
  };

  const handlePassword = (text) => {
    setPassword(text);
  };
  return (
    <View
      style={{
        ...styles.authContainer,
        paddingBottom: keyboardShown ? 45 : 32,
        marginBottom: keyboardShown ? -150 : 0,
      }}
    >
      <View style={styles.avatarThumb}></View>
      <Text style={styles.authTitle}>Реєстрація</Text>
      <TextInput
        style={styles.authInput}
        placeholder={"Логін"}
        onChangeText={handleLogin}
        value={login}
      />
      <TextInput
        style={styles.authInput}
        placeholder={"Адреса електронної пошти"}
        onChangeText={handleEmail}
        value={email}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.authInput}
          placeholder={"Пароль"}
          secureTextEntry={!showPassword}
          onChangeText={handlePassword}
          value={password}
        />
        <TouchableOpacity
          style={styles.togglePasswordButton}
          onPress={handleTogglePassword}
        >
          <Text style={styles.togglePasswordButtonText}>
            {showPassword ? "Приховати" : "Показати"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={onRegSubmit}>
        <Text style={styles.submitButtonText}>Зареєстуватися</Text>
      </TouchableOpacity>
      <Text style={styles.authLink}>Вже є акаунт? Увійти</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  authContainer: {
    backgroundColor: "#fff",
    width: "100%",
    marginTop: "auto",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  passwordContainer: {
    position: "relative",
  },

  togglePasswordButton: {
    position: "absolute",
    top: 16,
    right: 16,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  togglePasswordButtonText: {
    fontSize: 14,
    color: "#1B4371",
  },

  avatarThumb: {
    backgroundColor: "#F6F6F6",
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: -60,
    marginLeft: "auto",
    marginRight: "auto",
  },

  authTitle: {
    textAlign: "center",
    marginVertical: 16,
    letterSpacing: 0.01,
    fontSize: 30,
  },

  authInput: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  submitButton: {
    height: 50,
    backgroundColor: "#FF6C00",
    color: "#fff",
    borderRadius: 100,
    marginHorizontal: 16,
    marginTop: 43,
    justifyContent: "center",
    alignItems: "center",
  },

  submitButtonText: {
    fontSize: 16,
    color: "#fff",
  },

  authLink: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 10,
    textAlign: "center",
  },

  inputLinkText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 19,
    color: "#1B4371",
  },
});
