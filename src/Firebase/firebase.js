import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, collection, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyBcOIwpKCaZ-YkYg-1HS8UGdPBnoZr9px0",
  authDomain: "friendflow-7b9bb.firebaseapp.com",
  projectId: "friendflow-7b9bb",
  storageBucket: "friendflow-7b9bb.appspot.com",
  messagingSenderId: "129018510862",
  appId: "1:129018510862:web:82e1888a16912107eb065f",
  measurementId: "G-LLJKZJ0DC8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

const googleSignIn = async(navigate) => {
  signInWithPopup(auth, provider)
  .then(async(result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
    const snapShot = await getDocs(q);
    console.log(snapShot);
    const userRef = doc(db,'users', user?.uid)
    if (snapShot.empty) {
      await setDoc(userRef, {
        userName: user?.displayName || 'UnKnown',
        userPhoto: user?.photoURL || 'https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png',
        isActive: true,
        followers: [],
        following: [],
        createAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
        userEmail: user?.email,
        bgImage: 'https://placehold.co/600x400/EEE/31343C',
        uid: user?.uid
      });
      navigate('/')
  } else {
    await updateDoc(userRef, {
      isActive: true,
      lastSeen: serverTimestamp(),
    })
    navigate('/up')
      console.log('No user found');
  }
  }).catch((error) => {
    console.log(error);
    toast.error(error, {
      autoClose: 500
    })
  });
}

const uploadImage = async(uid,email, file, title, isImage, loader) => {
  if(file?.size < 20 * 1024 * 1024){
    loader(true)
  const storageRef = ref(storage, `${email}/${file?.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      toast.error(error?.message, {
        autoClose: 500
      })
    loader(false)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        console.log('File available at', downloadURL);
        try{
          await addDoc(collection(db, 'posts'), {
            image: downloadURL,
            uploadAt: serverTimestamp(),
            uid,
            likes: [],
            comments: [],
            title
          })
          isImage(false)
          loader(false)
        }catch(err){
          console.log(err);
          toast.error(err?.message, {
            autoClose: 500
          })
          loader(false)
        }
      });
    }
  );
}else{toast.warn('File Size 20 mb se Ziyada hai', {
  autoClose: 500
})}
}
const uploadVideo = async(uid,email, file, title, isVideo, loader) => {
  if(file?.size < 20 * 1024 * 1024){

    loader(true)

  const storageRef = ref(storage, `${email}/${file?.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      loader(false)
      toast.error(error?.message, {
        autoClose: 500
      })
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        console.log('File available at', downloadURL);
        try{
          await addDoc(collection(db, 'posts'), {
            video: downloadURL,
            uploadAt: serverTimestamp(),
            uid,
            likes: [],
            comments: [],
            title
          })
          isVideo(false)
          loader(false)
        }catch(err){
          loader(false)
          toast.error(err?.message, {
            autoClose: 500
          })
        }
      });
    }
  );
  }else{
    toast.warn('File Size 20 mb se Ziyada hai', {
    autoClose: 500
  })
  console.log('bari hai file');
  
}
}

export {
  auth,
  db,
  googleSignIn,
  uploadImage,
  uploadVideo,
  storage
}