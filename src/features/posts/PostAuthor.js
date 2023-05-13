import { useSelector } from "react-redux";
import { selectAllUsers, useGetUsersQuery } from "../users/usersSlice";
import { Link } from "react-router-dom";

const PostAuthor = ({ userId }) => {
  const { user: author } = useGetUsersQuery("getUsers", {
    selectFromResult: ({ data, isLoading }) => ({
      user: data?.entities[userId],
    }),
  });
 
  return (
    <span>
      by{" "}
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Unknown author"
      )}
    </span>
  );
};
export default PostAuthor;
