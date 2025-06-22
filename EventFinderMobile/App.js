// EventFinderMobile/App.js
import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from './app/store/store';
import AppNavigator from './app/navigation/AppNavigator';
import { loadToken } from './app/store/features/auth/authSlice';

const AppContent = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  return <AppNavigator />;
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
