import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

import { Feather } from '@expo/vector-icons';

import PostScreenTabs from "./Stack/PostScreenTabs";
import MapScreen from "./Stack/MapScreen";
import CommentsScreen from "./Stack/CommentsScreen";

const PostsStack = createStackNavigator();

export default function Home() {
  const navigation = useNavigation();

  return (
    <PostsStack.Navigator
      initialRouteName="PostsTabs"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ffffff",
          height: 80,
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowOffset: "0px 0.5px 0px"
        }}}>
      <PostsStack.Screen name="PostsTabs" component={PostScreenTabs} options={{headerShown: false}}/>
      <PostsStack.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitle: "Карта",
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
              onPress={() => navigation.navigate("PostsTabs")}
            >
              <Feather name="arrow-left" size={30} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
      <PostsStack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          headerTitle: "Коментарі",
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
              onPress={() => navigation.navigate("PostsTabs")}
            >
              <Feather name="arrow-left" size={30} color="#BDBDBD" />
            </TouchableOpacity>
          ),
        }}
      />
    </PostsStack.Navigator>   
  );
};