import React from "react";
import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersSlice";
import {
  useGetPostsByUserIdQuery,
} from "../posts/postsSlice";
import { Link } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const UserPage = () => {
  const { userId } = useParams();

  const {
    user,
    // isLoading: isLoadingUser,
    // isSuccess: isSuccessUser,
    // isError: isErrorUser,
    // error: errorUser,
  } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data,
      //  isLoading, isSuccess, isError, error 
      }) => ({
      user: data?.entities[userId],
      // isLoading,
      // isSuccess,
      // isError,
      // error,
    }),
  });

  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(userId);

  let content;
  if (isLoading) {
    content = <MoonLoader color="#d81cb9" size={250}/>
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id].title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};

export default UserPage;
