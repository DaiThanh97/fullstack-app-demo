import { Suspense, lazy } from 'react';
import { Navigate, Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Loading from './components/Loading';
const OrdersPage = lazy(() => import('./pages/Order'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          <Route path="/orders/*" element={<OrdersPage />} />
          <Route path="/" element={<Navigate to="/orders" />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Suspense>
  );
}

export default App;
