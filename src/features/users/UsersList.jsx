import React from "react";
import { Link } from "react-router-dom";
import { useGetUsersQuery } from "./usersSlice";
import { MoonLoader } from "react-spinners";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("getUsers");

  let content;
  if (isLoading) {
    content = <MoonLoader color="#d81cb9" size={250} />;
  } else if (isSuccess) {
    const renderedUsers = users.ids.map((userId) => (
      <li key={userId}>
        <Link to={`/user/${userId}`}>{users.entities[userId].name}</Link>
      </li>
    ));

    content = (
      <section>
        <h2>Users</h2>
        <ul>{renderedUsers}</ul>
      </section>
    );
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return content;
};

export default UsersList;
