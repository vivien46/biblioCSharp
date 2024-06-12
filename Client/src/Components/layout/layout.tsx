import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import UsersPage from '../../Pages/UsersPage';
import HomePage from '../../Pages/HomePage';
import RegisterForm from '../Users/RegisterForm';
import User from '../Users/User';
import UserEditForm from '../Users/UserEditForm';
import BooksPage from '../../Pages/BooksPage';
import BookAdd from '../Books/BookAdd';
import BookDetail from '../Books/BookDetail';
import BookUpdate from '../Books/BookUpdate';

const Layout: React.FC = () => {
    const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
    const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);

    const releaseYear = 2024;
    const currentYear = new Date().getFullYear();

    const toggleUsersDropdown = () => {
        setIsUsersDropdownOpen(!isUsersDropdownOpen);
    };

    const toggleBooksDropdown = () => {
        setIsBooksDropdownOpen(!isBooksDropdownOpen);
    };

    return (
        <Router>
            <div className="font-sans text-black antialiased flex flex-col min-h-screen">
                <header className="flex items-center justify-between p-6 bg-black border-b border-gray-200">
                    <nav className="flex items-center">
                        <ul className="flex uppercase space-x-10">
                            <li>
                                <Link to="/" className="rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Home</Link>
                            </li>
                            <li className="relative">
                                <button onClick={toggleUsersDropdown} className="py-1 space-x-2 rounded-md text-sm font-medium uppercase text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 focus:outline-none">
                                    Users
                                </button>
                                {isUsersDropdownOpen && (
                                    <ul className="absolute mt-1 mr-4 py-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <li>
                                            <Link to="/api/user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUsersDropdownOpen(false)}>Users List</Link>
                                        </li>
                                        <li>
                                            <Link to="/api/user/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUsersDropdownOpen(false)}>Add Users</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li className="relative">
                                <button onClick={toggleBooksDropdown} className="py-1 space-x-2 rounded-md text-sm font-medium uppercase text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 focus:outline-none">
                                    Books
                                </button>
                                {isBooksDropdownOpen && (
                                    <ul className="absolute mt-1 py-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <li>
                                            <Link to="/api/book" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsBooksDropdownOpen(false)}>Books List</Link>
                                        </li>
                                        <li>
                                            <Link to="/api/book/add" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsBooksDropdownOpen(false)}>Add Books</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </nav>
                    <div className="relative">

                        <ul className="px-3-2 py-2 uppercase flex">
                            <li>
                                <Link to="/api/user/register" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">Sign Up</Link>
                            </li>
                            <li>
                                <Link to="/api/user/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">Sign In</Link>
                            </li>
                        </ul>

                    </div>
                </header>

                <main className="flex-grow p-6 mb-6">
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/api/user' element={<UsersPage />} />
                        <Route path='/api/user/register' element={<RegisterForm />} />
                        <Route path='/api/user/:id' element={<User />} />
                        <Route path='/api/user/edit/:id' element={<UserEditForm />} />
                        <Route path='/api/book' element={<BooksPage />} />
                        <Route path='/api/book/add' element={<BookAdd />} />
                        <Route path='/api/book/:id' element={<BookDetail />} />
                        <Route path='/api/book/edit/:id' element={<BookUpdate />} />
                    </Routes>
                </main>

                <footer className="w-full p-6 bg-black border-t border-gray-200">
                    <p className="text-center text-gray-300">© { releaseYear } { currentYear > releaseYear ? ` - ${currentYear}` : ''} - All Right Reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

export default Layout;