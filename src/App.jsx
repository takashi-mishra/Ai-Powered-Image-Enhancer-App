import React from 'react'
import Imagepreview from '../Components/Imagepreview'
import Stockimages from '../Components/Stockimages'
import './App.css'
import GenrateImage from '../Components/GenrateImage'
import Footer from '../Components/Footer'
const App = () => {
  return (
    <>
      <h1 id='text'>Ai powered Image Enhancer</h1>
      <Imagepreview />

      <h1 id='text'>Stock images</h1>
      <Stockimages />
      <GenrateImage/>
      <Footer />
    </>
  )
}

export default App
