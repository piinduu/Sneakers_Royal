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
const NewExchange = React.lazy(() => import("./pages/NewExchange"));
const ExchangeDetails = React.lazy(() => import("./pages/ExchangeDetails"));
const ExchangeRequest = React.lazy(() => import("./pages/ExchangeRequest"));
const UserExchanges = React.lazy(() => import("./pages/UserExchanges"));
const SellInfo = React.lazy(() => import("./pages/SellInfo"));
const SellDetails = React.lazy(() => import("./pages/SellDetails"));
const SellSetPrice = React.lazy(() => import("./pages/SellSetPrice"));
const AllExchanges = React.lazy(() => import("./pages/AllExchanges"));
const AllExchangesDetails = React.lazy(() => import("./pages/AllExchangesDetails"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
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
          <Route
            path="/new-exchange"
            element={
              <ProtectedRoute>
                <Header />
                <NewExchange />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-exchange/details"
            element={
              <ProtectedRoute>
                <Header />
                <ExchangeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exchange-request"
            element={
              <ProtectedRoute>
                <Header />
                <ExchangeRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exchanges"
            element={
              <ProtectedRoute>
                <Header />
                <UserExchanges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <Header />
                <SellInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell/details"
            element={
              <ProtectedRoute>
                <Header />
                <SellDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell/set-price"
            element={
              <ProtectedRoute>
                <Header />
                <SellSetPrice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exchanges/all"
            element={
              <ProtectedRoute>
                <Header />
                <Subheader />
                <AllExchanges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exchanges/details/:id"
            element={
              <ProtectedRoute>
                <Header />
                <Subheader />
                <AllExchangesDetails />
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
