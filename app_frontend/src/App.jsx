import React, { Suspense } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Subheader from "./components/Subheader";

const Home = React.lazy(() => import("./pages/Home"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const SneakerPage = React.lazy(() => import("./pages/SneakerPage"));
const SneakerDetails = React.lazy(() => import("./pages/SneakerDetails"));
const PurchaseSummary = React.lazy(() => import("./pages/PurchaseSummary"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {/* Redirigir desde la raíz a /login */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Header />
                <Subheader />
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sneakers/:category"
            element={
              <ProtectedRoute>
                <Header />
                <Subheader />
                <SneakerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sneaker/:id"
            element={
              <ProtectedRoute>
                <Header />
                <SneakerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-summary"
            element={
              <ProtectedRoute>
                <PurchaseSummary />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
