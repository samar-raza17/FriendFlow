import React, { useContext, useEffect, useState } from 'react'
import { UploaderContext } from '../Context/UploaderProvider'
import { uploadImage, uploadVideo } from '../Firebase/firebase'
import { AuthContext } from '../Context/AuthProvider'

const PVUploads = () => {
  const { isImage, isVideo, setIsVideo, setIsImage } = useContext(UploaderContext)
  const [isFile, setIsFile] = useState(null)
  const [isTitle, setIsTitle] = useState('')
  const { authObj } = useContext(AuthContext)
  const [isLoad, setIsLoad] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (isFile) {
      const fileUrl = URL.createObjectURL(isFile)
      setPreviewUrl(fileUrl)
    }
    return () => URL.revokeObjectURL(previewUrl) // Clean up preview URL
  }, [isFile])

  useEffect(() => {
    console.log(isLoad)
  }, [isLoad])

  return (
    <div
      className={`${
        isVideo || isImage ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } origin-center transition-all duration-500 ease-out fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 bg-black/50 backdrop-blur-lg`}
    >
      <div className="relative max-w-[450px] w-full p-6 bg-white/40 backdrop-blur-md rounded-3xl shadow-lg border border-white/30 flex flex-col items-center gap-5 transition-transform duration-500 ease-out transform hover:scale-105">
        {isLoad && (
          <div className="loader2"></div>
        )}
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <i
            onClick={() => {
              setIsImage(false)
              setIsVideo(false)
              setIsFile(null)
              setPreviewUrl(null)
            }}
            className="fa-solid fa-xmark text-white w-8 h-8 bg-gray-800/60 rounded-full flex justify-center items-center hover:bg-gray-800/80 cursor-pointer transition duration-200 ease-in-out"
          ></i>
        </div>

        {/* Upload Header */}
        <h1 className="text-white text-4xl font-bold tracking-wide">
          Upload {isImage ? 'Image' : 'Video'}
        </h1>

        {/* Title Input */}
        <input
          value={isTitle}
          onChange={(e) => setIsTitle(e.target.value)}
          type="text"
          className="w-full bg-transparent text-white placeholder-white border border-gray-300 focus:border-blue-500 p-4 rounded-lg outline-none transition-all duration-300 focus:shadow-xl"
          maxLength={80}
          placeholder="Enter post title..."
        />

        {/* File Preview */}
        {previewUrl && (
          <div className="w-full h-[250px] flex justify-center items-center bg-white/20 border border-white/30 rounded-lg overflow-hidden shadow-lg">
            {isImage ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover h-full w-full"
              />
            ) : (
              <video src={previewUrl} className="object-cover h-full w-full" controls />
            )}
          </div>
        )}

        {/* File Input */}
        {!isLoad && (
          <input
            onChange={(e) => setIsFile(e.target.files[0])}
            type="file"
            className="hidden"
            id="file"
            accept={`${isImage ? 'image/*' : 'video/*'}`}
          />
        )}
        <label
          htmlFor="file"
          className="w-full flex justify-center items-center font-semibold text-xl h-[50px] bg-blue-500/90 rounded-lg text-white cursor-pointer hover:bg-blue-600 transition-all duration-300 shadow-lg"
        >
          <i className="fa-solid fa-upload mr-2"></i> Select File
        </label>

        {/* Upload Button */}
        <button
          disabled={isLoad || !isFile || !isTitle.trim()}
          onClick={() => {
            if (isImage) {
              uploadImage(
                authObj?.uid,
                authObj?.email,
                isFile,
                isTitle.trim(),
                setIsImage,
                setIsLoad
              )
            } else {
              uploadVideo(
                authObj?.uid,
                authObj?.email,
                isFile,
                isTitle.trim(),
                setIsVideo,
                setIsLoad
              )
            }
            setIsFile(null)
            setIsTitle('')
            setPreviewUrl(null)
          }}
          className={`w-full flex justify-center items-center font-semibold text-xl h-[50px] rounded-lg shadow-md transition-all duration-300 ${
            isLoad || !isFile || !isTitle.trim()
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 cursor-pointer hover:shadow-xl'
          }`}
        >
          {isLoad ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export default PVUploads
