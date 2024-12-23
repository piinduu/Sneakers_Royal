import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Exchanges from "./pages/Exchanges";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewExchange from "./pages/NewExchange";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SneakerDetails from "./pages/SneakerDetails";
import Sneakers from "./pages/Sneakers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sneakers" element={<Sneakers />} />
        <Route path="/sneakers/:id" element={<SneakerDetails />} />
        <Route path="/exchanges" element={<Exchanges />} />
        <Route path="/exchanges/new" element={<NewExchange />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
