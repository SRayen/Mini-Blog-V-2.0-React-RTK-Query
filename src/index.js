import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { fetchUsers } from "./features/users/usersSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { extendedApiSlice } from "./features/posts/postsSlice";

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());  //initiate() : get initial data
store.dispatch(fetchUsers());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
