import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import UserPage from '../Component/UserPage';
import HomePage from '../Component/HomePage';
import RegisterForm from '../Component/RegisterForm';

const Layout: React.FC = () => {
    return (
        <Router>
        <div className="font-sans text-black antialiased">
        <header className="flex items-center justify-between p-6 bg-black border-b border-gray-200">
                <nav className="flex-row items-center"> {/* Add className="flex-row" */}
                    <ul className="flex uppercase"> {/* Remove flex-row */}
                        <li><Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Home</Link></li>
                        <li><Link to="/api/user" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Users</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="p-6">
                <Routes>
                    <Route path='/' element={<HomePage />}/>
                    <Route path='/api/user' element={<UserPage />}/>
                    <Route path='/api/user/register' element={<RegisterForm />}/>
                </Routes>
            </main>
        </div>
        </Router>
    );
};

export default Layout;