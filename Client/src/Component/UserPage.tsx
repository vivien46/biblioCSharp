import React, { useState, useEffect } from "react";
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
    <div>
      {user ? (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {user.map((userItem: any, index: number) => (
              <tr key={index}>
                <td>{userItem.username}</td>
                <td>{userItem.email}</td>
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