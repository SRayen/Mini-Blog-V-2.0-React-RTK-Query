import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import SinglePostPage from "./features/posts/SinglePostPage";
import EditPost from "./features/posts/EditPost";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />
        {/* POST */}
        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPost />} />
        </Route>
        {/* USER */}
        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>
        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Route>
    </Routes>
  );
}

export default App;
