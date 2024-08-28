import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import HomePage from '../pages/HomePage';
import FavoritesPage from "../pages/FavoritesPage";
import CollectionsPage from "../pages/CollectionsPage";
import { Routes, Route } from "react-router-dom";

const MainLayout = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/favorites' element={<FavoritesPage />} />
        <Route path='/collections' element={<CollectionsPage />} />
      </Routes>
      <Footer />
    </React.Fragment>
  )
}

export default MainLayout;