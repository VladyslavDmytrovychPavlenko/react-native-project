import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";

export const LoginScreen = ({ keyboardShown }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onRegSubmit = () => {
    Keyboard.dismiss();
    console.log(email, password);
    setEmail(null);
    setPassword(null);
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
      <Text style={styles.authTitle}>Увійти</Text>

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
        <Text style={styles.submitButtonText}>Увійти</Text>
      </TouchableOpacity>
      <Text style={styles.authLink}>Немає акаунту? Зареєструватися</Text>
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
});
