import React, { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "./postsSlice";
import { useGetUsersQuery } from "../users/usersSlice";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const { post, isLoading: isLoadingPosts, isSuccess } = useGetPostsQuery('getPosts', {
    selectFromResult: ({ data, isLoading, isSuccess }) => ({
        post: data?.entities[postId],
        isLoading,
        isSuccess
    }),
})
  const { data: users, isSuccess: isSuccessUsers } =
    useGetUsersQuery("getUsers");

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (isSuccess) {
        setTitle(post.title)
        setContent(post.body)
        setUserId(post.userId)
    }
}, [isSuccess, post?.title, post?.body, post?.userId])

if (isLoadingPosts) return <p>Loading...</p>

  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  }

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);
  const onAuthorChanged = (e) => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        // unwrap() is used to handle the asynchronous result of that promise. If the promise is fulfilled,
        // unwrap() will return the result of the promise, otherwise it will throw an error.
        updatePost({ id: post?.id, title, body: content, userId }).unwrap();
        setTitle("");
        setContent("");
        setUserId("");
        navigate(`/post/${postId}`);
      } catch (error) {
        console.error("Failed to save the post", error);
        // finally block is used to ensure that certain code is always executed regardless of whether an error is thrown or not.
      }
    }
  };

  let usersOptions;
  if (isSuccessUsers ) {
    usersOptions = users.ids.map((id) => (
      <option key={id} value={id}>
        {users.entities[id].name}
      </option>
    ));
  }

  const onDeletePostClicked = async () => {
    try {
      await deletePost({ id: post.id }).unwrap();
      setTitle("");
      setContent("");
      setUserId("");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete the post", error);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select
          id="postAuthor"
          value={userId}
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        ></textarea>
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>

        <button
          className="deleteButton"
          type="button"
          onClick={onDeletePostClicked}
          disabled={!canSave}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default EditPost;
