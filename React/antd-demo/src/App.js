import React from 'react';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage'
import 'antd/dist/reset.css';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='*' element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

export default App;