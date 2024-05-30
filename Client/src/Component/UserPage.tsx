import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usersApi } from "../Api/users";

const UserPage: React.FunctionComponent = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    usersApi()
      .then((data: any) => {
        // console.log(data);
        setUser(data);
        
      })
      .catch((error: any) => {
        console.error("erreur lors de la récupération des données :", error);
      });
  }, []);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-center font-medium text-2xl mb-5">List of users</h1>

      <div className="border">
        <Link to="/api/user/register">
          <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-1 px-2 rounded">Add User</button>
        </Link>
      </div>

      {user ? (
        <table className="border-collapse border-2 border-gray-500 mt-5">
        <thead>
          <tr>
            <th className="border-2 border-gray-500 text-center p-2">Username</th>
            <th className="border-2 border-gray-500 text-center p-2">Email</th>
          </tr>
        </thead>
        <tbody className="border-2 border-gray-500">
          {user && user.map((userItem: any, index: number) => (
            <tr key={index} className="border-2 border-gray-500">
              <td className="border-2 border-gray-500 text-center p-2">{userItem.username}</td>
              <td className="border-2 border-gray-500 text-center p-2">{userItem.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default UserPage;