import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          //return the transformed post ==> it will be inserted in the loadedPosts
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        { type: "Post", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Post", id })),
      ],
    }),
    getPostsByUserId: builder.query({
      query: (id) => `/posts/?userId=${id}`,
      transformResponse: (responseData) => {
        let min = 1;
        const loadedPosts = responseData.map((post) => {
          if (!post?.date)
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          if (!post?.reactions)
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        console.log(result);
        return [...result.ids.map((id) => ({ type: "Post", id }))];
      },
    }),

    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      // arg : is the initialPost
      invalidatesTags: (result, error, arg) => [
        {
          type: "Post",
          id: arg.id,
        },
      ],
    }),

    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      // arg : is the initialPost
      invalidatesTags: (result, error, arg) => [
        {
          type: "Post",
          id: arg.id,
        },
      ],
    }),
    //We don't want to reload our list every time when we add a reaction ==> Here we will use Optimistic Update !!!
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          //updateQueryData: updates the cache state to reflect the reaction being added
          extendedApiSlice.util.updateQueryData(
            //endpoint name ("getPosts")
            "getPosts",
            // cache key (undefined in this case)
            undefined,
            //draft : represents the cache state
            (draft) => {
              // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            }
          )
        );
        //Remark: here is an Optimistic Update : Really what we are doing in patchResult is updating our cache =>possibly before the data
        //at the api has been updated ===>Instantly seeing that our UI is updated , then you see the network Request gi to the Api to
        //match what we already see in our UI.
        //But if it fails if any reason ===>It will undo what we have changed inside our cache (see catch {...}) .
        //So that is why we look for query fulfilled !
        try {
          //queryFulfilled promise is awaited inside a try-catch block. If the promise resolves successfully, the mutation process is completed.
          await queryFulfilled;
        } catch {
          //patchResult : can be used to undo (cancel) the cache update if an error occurs during the mutation process.
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

//Returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

//Creates memorized selector
const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data //Normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructing:
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  //Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(
  //Nullish coalescing operator (??) : returns its right-hand side operand when its left-hand side operand is null or undefined
  (state) => selectPostsData(state) ?? initialState
);
