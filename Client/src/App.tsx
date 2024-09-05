import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Components/layout/Layout';
import HomePage from './Pages/HomePage';
import UsersPage from './Pages/UsersPage';
import AuthForm from './Pages/AuthForm';
import Logout from './Pages/Logout';
import ChangePasswordPage from './Pages/ChangePasswordPage';
import ChangePasswordForm from './Components/Password/ChangePasswordForm';
import RegisterForm from './Components/Users/RegisterForm';
import User from './Components/Users/User';
import UserEditForm from './Components/Users/UserEditForm';
import UserDelete from './Components/Users/UserDelete';
import BooksPage from './Pages/BooksPage';
import BookAdd from './Components/Books/BookAdd';
import BookDetail from './Components/Books/BookDetail';
import BookUpdate from './Components/Books/BookUpdate';
import EmpruntAddForm from './Components/Emprunts/EmpruntAddForm';
import EmpruntList from './Components/Emprunts/EmpruntList';
import EmpruntDetail from './Components/Emprunts/EmpruntDetail';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/api/user' element={<UsersPage />} />
          <Route path='/api/user/register' element={<RegisterForm />} />
          <Route path='/api/user/login' element={<AuthForm />} />
          <Route path='/api/user/logout' element={<Logout />} />
          <Route path='/api/user/:id' element={<User />} />
          <Route path='/api/user/edit/:id' element={<UserEditForm />} />
          <Route path='/api/user/delete/:id' element={<UserDelete />} />
          <Route path='/api/user/change-password' element={<ChangePasswordPage />} />
          <Route path='/api/user/change-password/:id' element={<ChangePasswordForm />} />
          <Route path='/api/book' element={<BooksPage />} />
          <Route path='/api/book/add' element={<BookAdd />} />
          <Route path='/api/book/:id' element={<BookDetail />} />
          <Route path='/api/book/edit/:id' element={<BookUpdate />} />
          <Route path='/api/emprunt' element={<EmpruntList />} />
          <Route path='/api/emprunt/add' element={<EmpruntAddForm />} />
          <Route path='/api/emprunt/:id' element={<EmpruntDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App
