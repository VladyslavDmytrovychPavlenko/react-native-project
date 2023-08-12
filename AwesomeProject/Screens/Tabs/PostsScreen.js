import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { useSelector } from "react-redux";

import { collection, getDocs, doc } from 'firebase/firestore'; 
import { db } from '../../firebase/config';

export default function PostsScreen() {
  const { login, email, avatar } = useSelector(state => state.auth)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();

    const timerId = setInterval(() => {      
      getPosts();      
    }, 30000);
   
    return () => clearInterval(timerId);    
  }, []);


  const getPosts = async () => {
    try {
      const allPosts = [];

      const snapshot = await getDocs(collection(db, 'posts'));
      snapshot.forEach((doc) => allPosts.push({ ...doc.data(), id: doc.id }));

      const sortedPostsByDate = allPosts.sort(
        (firstPost, secondPost) => firstPost.date - secondPost.date
      );

      setPosts(sortedPostsByDate);
    } catch (error) {
      console.log(error);
    }
  };
    
  const ref = useRef();
  const navigation = useNavigation();

  const renderItem = ({ item }) => <Post item={item} />

  const Post = ({ item }) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
      getNumberOfComments(item.id);
    }, []);
    
    const getNumberOfComments = async (id) => {
      try {
        const allComments = [];

        const refPost = doc(db, "posts", id);      
        const snapshot = await getDocs(collection(refPost, "comments"));
        snapshot.forEach((doc) => allComments.push({ ...doc.data() }))

        setCounter(allComments.length);     
      } catch (error) {
        console.log(error);
      }
    };
    
    return (
      <TouchableOpacity activeOpacity={1} style={styles.post}>
     
        <View style={styles.photoContainer}>
          <Image source={{ uri: item.photo }} style={styles.photo} />
        </View>
    
        <Text style={styles.postLabel}>{item.label}</Text>
     
        <View style={styles.postControls}>
         
          <TouchableOpacity
            style={styles.postLink}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(
                "Comments",
                { photoSource: item.photo, idPost: item.id }
              )
            }}
          >
            {
              (counter > 0)
                ? <FontAwesome name="comment" size={24} color="#FF6C00" style={{ transform: [{ rotateY: '180deg' }] }} />
                : <FontAwesome name="comment-o" size={24} color="#BDBDBD" style={{ transform: [{ rotateY: '180deg' }] }} />
            }
            <Text style={{
              ...styles.textLink,
              color: (counter > 0) ? "#212121" : "#BDBDBD",
              textDecorationLine: "none"
            }}>
              {counter}
            </Text>
            
          </TouchableOpacity>
          {/* link to map */}
          <TouchableOpacity
            style={styles.postLink}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate(
                "Map",
                { location: item.location, label: item.label, place: item.place }
              )
            }}
          >
            <Feather name="map-pin" size={24} color="#BDBDBD" />
            <Text style={styles.textLink}>{item.place}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handleScrollToEnd = (width, height) => {
    if (ref.current) {
      ref.current.scrollToOffset({ offset: height });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.wrapPhoto}>
          {avatar && <Image source={{ uri: avatar }}
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "cover"
            }} />}
          
        </View>
        <View>
          <Text style={styles.textName}>{login}</Text>
          <Text style={styles.textEmail}>{email}</Text>
        </View>
      </View>

      <View style={styles.posts}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted={true}
          ref={ref}
          onContentSizeChange={handleScrollToEnd}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
  },

  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 32,
  },

  wrapPhoto: {
    marginRight: 8,
    width: 60,
    height: 60,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    overflow: "hidden"
  },

  textName: {
    fontFamily: "Roboto-Bold",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 15,
    color: "#212121",
  },

  textEmail: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 13,
    color: "rgba(33, 33, 33, 0.8)",
  },

  posts: {
    paddingTop: 32,
    paddingBottom: 64,
  },

  post: {
    marginBottom: 32,
  },

  photoContainer: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    overflow: "hidden",
  },

  photo: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
  
  postLabel: {
    marginTop: 8,
    fontFamily: "Roboto-Bold",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },

  postControls: {
    marginTop: 11,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  postLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  textLink: {
    fontFamily: "Roboto-Regular",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    textDecorationLine: 'underline',
  },
});