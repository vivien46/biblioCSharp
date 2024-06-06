import React from "react";
import { Link } from "react-router-dom";
import UserList from "../Components/Users/UserList";

const UsersPage: React.FunctionComponent = () => {
 
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-center font-medium text-2xl mb-5">List of users</h1>

      <div className="border flex flex-row justify-between">
        <Link to="/api/user/register">
          <button className="bg-green-700 hover:bg-green-500 text-white font-bold py-1 px-2 rounded">Add User</button>
        </Link>
      </div>

      <UserList />
    </div>
  );
}

export default UsersPage;