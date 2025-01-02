import React, { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import Subheader from './components/Subheader';

// Importación perezosa de componentes
const Home = React.lazy(() => import('./pages/Home'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const SneakerPage = React.lazy(() => import('./pages/SneakerPage'));
const SneakerDetails = React.lazy(() => import('./pages/SneakerDetails')); // Nuevo componente

function App() {
  return (
    <Router>
      <Header />
      <Subheader />
      {/* Suspense envuelve las rutas con componentes perezosos */}
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sneakers/:category" element={<SneakerPage />} />
          <Route path="/sneaker/:id" element={<SneakerDetails />} /> {/* Nueva ruta */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
