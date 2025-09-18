import './App.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from './redux/actions/auth.action';
import AllRoutes from './routes/AllRoutes';

function App() {
  const dispatch = useDispatch();
   useEffect(() => {
    dispatch(fetchUser()); // gọi 1 lần khi load trang
  }, [dispatch]);

  return (
    <>
      <AllRoutes />
    </>
  );
}

export default App;
