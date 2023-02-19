import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axious from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";

function Post() {
  let navigate = useNavigate();
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axious
      .get(`https://onlyworking-production.up.railway.app/posts/byId/${id}`)
      .then((response) => {
        setPostObject(response.data);
      });

    axious
      .get(`https://onlyworking-production.up.railway.app/comments/${id}`)
      .then((response) => {
        setComments(response.data);
      });
  }, []);

  const addComment = (data) => {
    axious
      .post(
        "https://onlyworking-production.up.railway.app/comments",
        { commentBody: newComment, PostId: id },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          axious
            .get(`https://onlyworking-production.up.railway.app/comments/${id}`)
            .then((response) => {
              setComments(response.data);
            });
          // const commentToAdd = {
          //   commentBody: newComment,
          //   username: response.data.username,
          // };
          // setComments([...comments, commentToAdd]);
          // setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axious
      .delete(`https://onlyworking-production.up.railway.app/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };

  const deletePost = () => {
    axious
      .delete(`https://onlyworking-production.up.railway.app/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        navigate("/");
      });
  };
  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter new Title:");
      axious.put(
        "https://onlyworking-production.up.railway.app/posts/title",
        { newTitle: newTitle, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter new Text:");
      axious.put(
        "https://onlyworking-production.up.railway.app/posts/postText",
        { newPostText: newPostText, id: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
      setPostObject({ ...postObject, postText: newPostText });
    }
  };
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comments</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
