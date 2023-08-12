import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut, 
} from "firebase/auth";
import { Alert } from "react-native";
import { authActions } from "./authSlice";

import { auth } from '../../firebase/config';

const { updateUserProfile, authStateChange, authSignOut  } = authActions;

export const authSignUpUser = ({ email, password, login, avatar }) =>
  async (dispatch, getState) => {
    try {           
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: login, photoURL: avatar });
            
      const user = auth.currentUser;      

      if (user) {
        dispatch(updateUserProfile({
          userId: user.uid,
          login: user.displayName,
          email: user.email,
          avatar: user.photoURL
        }));
      };
        
    } catch (error) {
      console.log(error);      
    }
  };

export const authSignInUser = ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(updateUserProfile({
            userId: user.uid,
            login: user.displayName,
            email: user.email,
            avatar: user.photoURL
          }));

          Alert.alert(`Ласкаво просимо ${user.displayName}`)
        });
    } catch (error) {
      console.log(error);      
      Alert.alert(`Ви ввели неправильний email aбо password. Cпробуйте ще раз.`)
    }
  };

export const authSignOutUser = () =>
  async (dispatch, getState) => {
    try {
      await signOut(auth)
        .then(dispatch(authSignOut()));
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

export const authStateChangeUser = () =>
  async (dispatch, getState) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(updateUserProfile({
          userId: user.uid,
          login: user.displayName,
          email: user.email,
          avatar: user.photoURL
        }));
        dispatch(authStateChange({ stateChange: true }));        
      };

    });
  };

export const authDeleteUserAvatar = () =>
  async (dispatch, getState) => {
    try {
      await updateProfile(auth.currentUser, { photoURL: "" });
      const user = auth.currentUser;
      
      if (user) {
        dispatch(updateUserProfile({
          userId: user.uid,
          login: user.displayName,
          email: user.email,
          avatar: user.photoURL
        }));
      };
        
    } catch (error) {
      console.log(error);
    }
  };

export const authUpdateUserAvatar = ({ avatarUrl }) =>
  async (dispatch, getState) => {
    try {
      await updateProfile(auth.currentUser, { photoURL: avatarUrl });
      const user = auth.currentUser;
      
      if (user) {
        dispatch(updateUserProfile({
          userId: user.uid,
          login: user.displayName,
          email: user.email,
          avatar: user.photoURL
        }));
      };
        
    } catch (error) {
      console.log(error);
    }
  };
  

