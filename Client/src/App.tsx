import React from 'react';
import { AuthProvider } from './Contexts/AuthContext';
import Layout from './Components/layout/layout';
import './index.css';

const App: React.FC = () => {
  return (
      <AuthProvider>
          <div className="App">
              <Layout />
          </div>
      </AuthProvider>
  );
};

export default App
