import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Camera, FlashMode, AutoFocus } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

// import icons
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { nanoid } from "@reduxjs/toolkit";
import { storage, db } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

export default function CreatePostsScreen({}) {
  const [label, setLabel] = useState("");
  const [place, setPlace] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoSource, setPhotoSource] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [location, setLocation] = useState(null);
  const { userId, login } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const camera = await Camera.requestCameraPermissionsAsync();
      const location = await Location.requestForegroundPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(
        camera.status === "granted" && location.status === "granted"
      );
    })();
  }, []);

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  let hasPermissionPublish =
    label.length > 0 && place.length > 0 && photoSource && location;

  const takePhoto = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      if (uri) {
        setPhotoSource(uri);
        setIsPreview(true);
      }
      await MediaLibrary.createAssetAsync(uri);

      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(coords);
    }
  };

  const uploadPhotoToServer = async () => {
    let photoUrl = "";

    const response = await fetch(photoSource);
    const file = await response.blob();
    const uniquePostId = nanoid();
    const storageRef = ref(storage, `postImage/${uniquePostId}`);

    await uploadBytes(storageRef, file);
    await getDownloadURL(storageRef).then((url) => {
      photoUrl = url;
    });

    return photoUrl;
  };

  const uploadPostToServer = async () => {
    const date = new Date().getTime();
    const photo = await uploadPhotoToServer();

    try {
      await addDoc(collection(db, "posts"), {
        date,
        photo,
        label,
        place,
        location,
        userId,
        login,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const onClearCamera = () => {
    setPhotoSource(null);
    setLocation(null);
    setIsPreview(false);
  };

  const onClearData = () => {
    Keyboard.dismiss();
    setLabel("");
    setPlace("");
    onClearCamera();
  };

  const onSubmit = () => {
    onClearData();
    if (hasPermissionPublish) {
      uploadPostToServer();
      onClearData();
      navigation.navigate("Posts");
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Permission to access the camera or location was denied</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.photoContent}>
        {/* camera */}
        <View style={styles.cameraContainer}>
          {isFocused && (
            <Camera
              style={styles.camera}
              ref={setCameraRef}
              flashMode={FlashMode.auto}
              AutoFocus={AutoFocus.on}
            />
          )}

          {isPreview && (
            <View style={styles.previewPhotoContainer}>
              <Image
                source={{ uri: photoSource }}
                style={{
                  height: "100%",
                  width: "100%",
                  resizeMode: "cover",
                }}
              />
            </View>
          )}

          <TouchableOpacity
            style={{
              ...styles.btnSnapshot,
              backgroundColor: isPreview
                ? "rgba(255, 255, 255, 0.30)"
                : "#FFFFFF",
            }}
            activeOpacity={0.8}
            onPress={!isPreview ? takePhoto : onClearCamera}>
            <MaterialIcons
              name="photo-camera"
              size={30}
              color={isPreview ? "#FFFFFF" : "#BDBDBD"}
            />
          </TouchableOpacity>
        </View>
        {/* action instructions */}
        <TouchableOpacity style={styles.action} activeOpacity={0.8}>
          <Text style={styles.actionText}>
            {photoSource ? "Редагувати фото" : "Завантажте фото"}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "heigth"}>
        {/* form */}
        <View style={styles.form}>
          {/* input label */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Назва..."
              placeholderTextColor="#BDBDBD"
              value={label}
              onChangeText={setLabel}
            />
          </View>
          {/* input place */}
          <View
            style={{
              ...styles.inputWrapper,
              marginTop: 16,
              flexDirection: "row",
              gap: 8,
            }}>
            <Feather name="map-pin" size={24} color="#BDBDBD" />
            <TextInput
              style={styles.input}
              placeholder="Місцевість..."
              placeholderTextColor="#BDBDBD"
              value={place}
              onChangeText={setPlace}
            />
          </View>
          {/* btn Submit */}
          <TouchableOpacity
            style={{
              ...styles.btnForm,
              backgroundColor: hasPermissionPublish ? "#FF6C00" : "#F6F6F6",
            }}
            activeOpacity={0.8}
            onPress={onSubmit}
            disabled={!hasPermissionPublish}>
            <Text
              style={{
                ...styles.btnFormTitle,
                color: hasPermissionPublish ? "#FFFFFF" : "#BDBDBD",
              }}>
              Опублікувати
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={{ flex: 1 }}></View>

      <TouchableOpacity
        style={{
          ...styles.btnForm,
          marginBottom: 30,
          height: 40,
          width: 70,
          padding: 8,
          alignSelf: "center",
          backgroundColor: "#F6F6F6",
        }}
        activeOpacity={0.8}
        onPress={onClearData}>
        <Feather name="trash-2" size={24} color="#BDBDBD" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },

  photoContent: {
    marginTop: 32,
    flexDirection: "column",
  },

  cameraContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 240,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },

  camera: {
    width: "100%",
    height: "100%",
  },

  previewPhotoContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  btnSnapshot: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 50,
  },

  action: {
    marginTop: 8,
  },

  actionText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 15,
    color: "#BDBDBD",
  },

  form: {
    marginTop: 32,
  },

  inputWrapper: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },

  input: {
    width: "100%",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#212121",
  },

  btnForm: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    padding: 16,
    borderRadius: 25,
  },

  btnFormTitle: {
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    fontSize: 16,
    color: "#BDBDBD",
  },
});
