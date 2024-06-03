import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import UserPage from '../Component/UserPage';
import HomePage from '../Component/HomePage';
import RegisterForm from '../Component/RegisterForm';
import BookPage from '../Component/BookPage';
import BookAdd from '../Component/BookAdd';

const Layout: React.FC = () => {
    return (
        <Router>
        <div className="font-sans text-black antialiased">
        <header className="flex items-center justify-between p-6 bg-black border-b border-gray-200">
                <nav className="flex-row items-center"> {/* Add className="flex-row" */}
                    <ul className="flex uppercase"> {/* Remove flex-row */}
                        <li><Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Home</Link></li>
                        <li><Link to="/api/user" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Users</Link></li>
                        <li><Link to="/api/book" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Books</Link></li>
                        <li><Link to="/api/book/add" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Add books</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="p-6">
                <Routes>
                    <Route path='/' element={<HomePage />}/>
                    <Route path='/api/user' element={<UserPage />}/>
                    <Route path='/api/user/register' element={<RegisterForm />} />
                    <Route path='/api/book' element={<BookPage />} />
                    <Route path='/api/book/add' element={<BookAdd />} />
                </Routes>
            </main>
        </div>
        </Router>
    );
};

export default Layout;