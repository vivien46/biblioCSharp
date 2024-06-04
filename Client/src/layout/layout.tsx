import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import UserPage from '../Component/UserPage';
import HomePage from '../Component/HomePage';
import RegisterForm from '../Component/RegisterForm';
import BooksPage from '../Component/BooksPage';
import BookAdd from '../Component/BookAdd';
import Book from '../Component/Book';

const Layout: React.FC = () => {
    const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
    const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);

    const toggleUsersDropdown = () => {
        setIsUsersDropdownOpen(!isUsersDropdownOpen);
    };

    const toggleBooksDropdown = () => {
        setIsBooksDropdownOpen(!isBooksDropdownOpen);
    };

    return (
        <Router>
            <div className="font-sans text-black antialiased">
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

                <main className="p-6">
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/api/user' element={<UserPage />} />
                        <Route path='/api/user/register' element={<RegisterForm />} />
                        <Route path='/api/book' element={<BooksPage />} />
                        <Route path='/api/book/add' element={<BookAdd />} />
                        <Route path='/api/book/:id' element={<Book />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default Layout;