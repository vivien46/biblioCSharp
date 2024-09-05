import React, { useEffect, useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isUserLoggedIn, username, userRole, checkUserLoggedIn } = useAuth();

  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [isEmpruntDropdownOpen, setIsEmpruntDropdownOpen] = useState(false);

  const usersDropdownRef = useRef<HTMLLIElement>(null);
  const booksDropdownRef = useRef<HTMLLIElement>(null);
  const empruntDropdownRef = useRef<HTMLLIElement>(null);

  const releaseYear = 2024;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    checkUserLoggedIn();

    const handleOutsideClick = (event: MouseEvent) => {
      if (usersDropdownRef.current && !usersDropdownRef.current.contains(event.target as Node)) {
        setIsUsersDropdownOpen(false);
      }
      if (booksDropdownRef.current && !booksDropdownRef.current.contains(event.target as Node)) {
        setIsBooksDropdownOpen(false);
      }
      if (empruntDropdownRef.current && !empruntDropdownRef.current.contains(event.target as Node)) {
        setIsEmpruntDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [checkUserLoggedIn]);

  const toggleUsersDropdown = () => {
    setIsUsersDropdownOpen(!isUsersDropdownOpen);
  };

  const toggleBooksDropdown = () => {
    setIsBooksDropdownOpen(!isBooksDropdownOpen);
  };

  const toggleEmpruntDropdown = () => {
    setIsEmpruntDropdownOpen(!isEmpruntDropdownOpen);
  };

  return (
    <div className="font-sans text-black antialiased flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-6 bg-black border-b border-gray-200">
        <nav className="flex items-center">
          <ul className="flex uppercase space-x-10">
            <li>
              <Link to="/" className="rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150">Home</Link>
            </li>
            <li className="relative" ref={usersDropdownRef}>
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
            <li className="relative" ref={booksDropdownRef}>
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
            <li className='relative' ref={empruntDropdownRef}>
              <button onClick={toggleEmpruntDropdown} className="py-1 space-x-2 rounded-md text-sm font-medium uppercase text-gray-300 hover:text-white hover:bg-gray-700 transition duration-150 focus:outline-none">
                Emprunts
              </button>
              { isEmpruntDropdownOpen && (
              <ul className="absolute mt-1 py-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <li>
                  <Link to="/api/emprunt" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Liste des emprunts</Link>
                </li>
                <li>
                  <Link to="/api/emprunt/add" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ajouter un emprunt</Link>
                </li>
                </ul>
                )}
            </li>
          </ul>
        </nav>
        <div className="relative">
          <ul className="px-3-2 py-2 uppercase flex">
            {!isUserLoggedIn && (
              <li>
                <Link to="/api/user/register" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">Register</Link>
              </li>
            )}
            {isUserLoggedIn ? (
              <li className='text-white'>
                Bienvenue<span className='text-red-500 capitalize'> {username} ( {userRole === "Admin" ? (`${userRole}`) : ""} )</span><Link to="/api/user/logout" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">Log Out</Link>
              </li>
            ) : (
              <li>
                <Link to="/api/user/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700">Log In</Link>
              </li>
            )}
          </ul>
        </div>
      </header>

      <main className="flex-grow p-6 mb-6">
        {children}
      </main>

      <footer className="w-full p-6 bg-black border-t border-gray-200">
        <p className="text-center text-gray-100 uppercase">© {releaseYear} {currentYear > releaseYear ? ` ${currentYear}` : ''} - BiblioCsharp Compagny - All Right Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
