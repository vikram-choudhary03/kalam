import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Replace the following with your app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJJLGF57N14KdM2f-JvWRt8zz27mKA5Is",
  authDomain: "kalam-543f8.firebaseapp.com",
  projectId: "kalam-543f8",
  storageBucket: "kalam-543f8.firebasestorage.app",
  messagingSenderId: "131325648142",
  appId: "1:131325648142:web:ac2bbf08c04cbb4e934b5f",
  measurementId: "G-KETNC7YPQE",
};

const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authwithgoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log(errorCode+" "+errorMessage+" "+ email+" "+ credential); 
    });

    return user ; 
};
