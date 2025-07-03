import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import { AuthContext } from '../Context/AuthProvider';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../Firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';

const UP = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isLoad, setIsLoad] = useState(false)

  const navigate = useNavigate();

  const {authObj} = useContext(AuthContext);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(profileImage && bio.trim()?.length > 9 && name?.trim()?.length> 2){
      setIsLoad(true)
      if(profileImage?.size < 20 * 1024 * 1024){
        const storageRef = ref(storage, `${authObj?.email}/${profileImage?.name}`);
  const uploadTask = uploadBytesResumable(storageRef, profileImage);
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
      setIsLoad(!true)
      toast.error(error?.message, {
        autoClose: 500
      })
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        console.log('File available at', downloadURL);
        const q = query(collection(db, 'users'), where('uid', '==', authObj?.uid));
      const snapShot = await getDocs(q)
      await updateDoc(doc(db, 'users', snapShot?.docs[0]?.id), {
        userName: name,
        userPhoto: downloadURL,
        bio,
      })
      setIsLoad(!true)
      setProfileImage(null)
      setName('')
      setBio('')
      navigate('/')
      });
    }
  );
      }else{
        alert('bro IMages ki Size bari hai')
        setIsLoad(!true)
      }
    }else{
      alert('bro ye kiya hai');
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-5">
      {isLoad && <div className="loader2" style={{color: '#3b82f6 '}} ></div>}
      <div className="bg-white shadow-md rounded-lg w-full max-w-xl p-6">
        
        {/* Back Button */}
        <button
          className="mb-6 text-blue-600 font-bold flex items-center hover:underline"
          onClick={() => navigate('/')}  // Go back to the previous page
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Profile Image */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="relative w-full h-full rounded-full bg-gray-200">
            {profileImage ? (
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="w-full h-full text-gray-500 flex items-center justify-center rounded-full bg-gray-300">
                No Image
              </span>
            )}
            <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </label>
            <input
            required
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
            required
            minLength={3}
            maxLength={20}
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="bio">
              Short Bio
            </label>
            <textarea
            required
            minLength={5}
            maxLength={40}
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell something about yourself"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
            disabled={isLoad}
              type="submit"
              className={`w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-300 ${isLoad && 'cursor-not-allowed'}`}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UP;
