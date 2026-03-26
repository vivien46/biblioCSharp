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
import ProtectedRoute from './Components/Routes/ProtectedRoute';
import AdminRoute from './Components/Routes/AdminRoute';
import OwnerOrAdminRoute from './Components/Routes/OwnerOrAdminRoute';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />

          <Route path='/api/user/login' element={<AuthForm />} />
          <Route path='/api/user/register' element={<RegisterForm />} />
          <Route path='/api/user/logout' element={<Logout />} />

          <Route
            path='/api/user'
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />

          <Route
            path='/api/user/:id'
            element={
              <OwnerOrAdminRoute>
                <User />
              </OwnerOrAdminRoute>
            }
          />

          <Route
            path='/api/user/edit/:id'
            element={
              <OwnerOrAdminRoute>
                <UserEditForm />
              </OwnerOrAdminRoute>
            }
          />

          <Route
            path='/api/user/delete/:id'
            element={
              <AdminRoute>
                <UserDelete />
              </AdminRoute>
            }
          />

          <Route
            path='/api/user/change-password'
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/api/user/change-password/:id'
            element={
              <OwnerOrAdminRoute>
                <ChangePasswordForm />
              </OwnerOrAdminRoute>
            }
          />

          <Route path='/api/book' element={<BooksPage />} />
          <Route path='/api/book/:id' element={<BookDetail />} />

          <Route
            path='/api/book/add'
            element={
              <AdminRoute>
                <BookAdd />
              </AdminRoute>
            }
          />

          <Route
            path='/api/book/edit/:id'
            element={
              <AdminRoute>
                <BookUpdate />
              </AdminRoute>
            }
          />

          <Route
            path='/api/emprunt'
            element={
              <ProtectedRoute>
                <EmpruntList />
              </ProtectedRoute>
            }
          />

          <Route
            path='/api/emprunt/:id'
            element={
              <ProtectedRoute>
                <EmpruntDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path='/api/emprunt/add'
            element={
              <AdminRoute>
                <EmpruntAddForm />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;