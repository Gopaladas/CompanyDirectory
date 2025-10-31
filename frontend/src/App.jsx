import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CompaniesList from "./components/CompaniesList";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<CompaniesList />} />
      </Routes>
    </Router>
  );
};

export default App;
