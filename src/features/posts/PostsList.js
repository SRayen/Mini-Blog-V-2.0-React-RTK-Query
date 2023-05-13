import { useGetPostsQuery } from "./postsSlice";
import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import PostsExcerpt from "./PostsExcerpt";
import { MoonLoader } from "react-spinners";

const PostsList = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery("getPosts");

  let content;
  if (isLoading) {
    // content = <p>"Loading..."</p>;
    content =  
    <MoonLoader color="#d81cb9" size={250}/>

  } else if (isSuccess) {
    content = posts.ids.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
export default PostsList;
