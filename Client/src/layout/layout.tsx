import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import UserPage from '../Component/UserPage';

const Layout: React.FC = () => {
    return (
        <Router>
        <div>
            <header>
                <h1>My Website</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/api/user">Users</Link></li>
                    </ul>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path='/' element={<p>Welcome to my website</p>}/>
                        
                    <Route path='/api/user' element={<UserPage />} />
                </Routes>
            </main>

            <footer>
                &copy; { new Date().getFullYear() }
            </footer>
        </div>
        </Router>
    );
};

export default Layout;