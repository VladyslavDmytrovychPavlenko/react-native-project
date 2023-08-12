import { useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { Feather } from '@expo/vector-icons';

import PostsScreen from "../Tabs/PostsScreen";
import CreatePostsScreen from "../Tabs/CreatePostsScreen";
import ProfileScreen from "../Tabs/ProfileScreen";
import { authSignOutUser } from "../../redux/auth/authOpration";

const Tabs = createBottomTabNavigator();

export default function PostScreenTabs() {

  const [isChangedIcon, setIsChangedIcon] = useState(false);
  const navigation = useNavigation();
  const dispath = useDispatch();

  return (
    <Tabs.Navigator
      initialRouteName="Posts"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 25,
          backgroundColor: "#ffffff",
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowOffset: "0px 0.5px 0px"
        },
        headerStyle: {
          backgroundColor: "#ffffff",
          height: 80,
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowOffset: "0px 0.5px 0px"
        }
      }}
    >
      <Tabs.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          headerTitle: "Публікації",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#212121",
            fontSize: 18,
            fontFamily: "Roboto-Medium",
            fontWeight: 500
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 20 }}
              activeOpacity={0.8}
              onPress={() => dispath(authSignOutUser())}
            >
              <Feather name="log-out" size={25} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          tabBarButton: (props) =>
            <TouchableOpacity
              {...props}
              activeOpacity={0.8}
              onPress={() => {
                setIsChangedIcon(false);
                navigation.navigate("Posts");
              }}
            />,
          tabBarIcon: ({ focused, size, color }) => <Feather name="grid" size={size} color="#BDBDBD" />,         
        }}
      />
      <Tabs.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          headerTitle: "Створити публікацію",
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#212121",
            fontSize: 18,
            fontFamily: "Roboto-Medium",
            fontWeight: 500
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 20 }}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Posts")}
            >
              <Feather name="arrow-left" size={30} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          tabBarStyle: { display: 'none' },
          tabBarButton: (props) =>
            <TouchableOpacity
              {...props}
              style={{
                backgroundColor: '#FF6C00',
                width: 70,
                height: 40,
                borderRadius: 50
              }}
              activeOpacity={0.8}
              onPress={() => {
                isChangedIcon 
                  ? navigation.navigate("Profile")
                  : navigation.navigate("CreatePosts")              
              }}
            />,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              isChangedIcon
                ? <Feather name="user" size={size} color="#FFFFFF" />              
                : <Feather name="plus" size={size} color="#FFFFFF" />
            )
          },          
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarButton: (props) =>
            <TouchableOpacity
              {...props}
              activeOpacity={0.8}
              onPress={() => {
                if (isChangedIcon) {
                  navigation.navigate("CreatePosts");
                  setIsChangedIcon(false);
                } else {
                  setIsChangedIcon(true);
                  navigation.navigate("Profile");
                }  
              }}
            />,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              isChangedIcon
              ? <Feather name="plus" size={size} color="#BDBDBD" />
              : <Feather name="user" size={size} color="#BDBDBD" />
            );
          },
        }}
      />
    </Tabs.Navigator>
  );
};