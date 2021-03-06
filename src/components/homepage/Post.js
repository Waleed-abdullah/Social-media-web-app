import React, { useState, useEffect } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './Post.css';
import Comment from './Comment.js';
import { saveComment } from '../../Controllers/apiCalls';
import { useStateValue } from '../../State/StateProvider';
import axios from 'axios';

const Post = React.memo(({ post }) => {
  const [{ user }, dispatch] = useStateValue();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [colorOfHeart, setColorOfHeart] = useState('#EEE5EE');
  const [dotIconClick, setDotIconClick] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      const res = await axios.get(`http://localhost:5000/get/comment/${post.postID}`);
      if (comments.length === 0) {
        setComments(comments.concat(res.data.results));
      }
    }
    async function fetchLikes() {
      const res = await axios.get(`http://localhost:5000/get/like`, {params: { userID: user.uid, postID: post.postID }});
      if (res.data.results.length > 0) {
        setColorOfHeart('#804FC0');
      } else {
        setColorOfHeart('#EEE5EE');
      }
    }
    fetchComments();
    fetchLikes();
  }, []);

  const handleChangeHeartColor = async () => {
    console.log('in heart handle');
    if (colorOfHeart === '#EEE5EE') {
      setColorOfHeart('#804FC0');
      await axios({
        method: 'post',
        url: `http://localhost:5000/set/like`,
        data: {
          userID: user.uid,
          postID: post.postID,
        },
      });
    } else {
      setColorOfHeart('#EEE5EE');
      await axios({
        method: 'delete',
        url: `http://localhost:5000/delete/like`,
        data: {
          userID: user.uid,
          postID: post.postID,
        },
      });
    }
  };

  const handleChangeInViewComments = () => {
    console.log('in view comments');
    showComments ? setShowComments(false) : setShowComments(true);
  };

  const handleCommentText = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    console.log('In here');
    saveComment(user, post.postID, commentText, comments, setComments);

    setCommentText('');
  };

  const handleMoreClick = async () => {
    if (post.postImage){
      await axios({
        method: 'get',
        url: `http://localhost:5000/retrieve/${post.postImage}`,
        responseType: 'blob'
      }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${post.postImage}`)
        document.body.appendChild(link)
        link.click()
      })
    }
  }

  return (
    <div className="postContainer">
      <div className="upperArea">
        <div className="nameImageTime">
          <img className="profilePic" src={post.photoURL} alt="pfp"></img>
          <h4 style={{ paddingLeft: 5, color: '#4E4E4E' }}>
            {post.name}{' '}
            <span style={{ fontSize: '10px' }}>
              <em>
                posted at{' '}
                {new Date(
                  new Date(post.postTimestamp).setHours(
                    new Date(post.postTimestamp).getHours() + 5
                  )
                ).toUTCString()}
              </em>
            </span>
          </h4>
        </div>
        <div>
          <MoreHorizIcon onClick={() => setDotIconClick(!dotIconClick)} className='dotsIcon' fontSize="large"></MoreHorizIcon>
          {dotIconClick ? (<div><button className='saveFileButton' onClick={handleMoreClick}>Save File</button></div>) : (console.log(''))}
        </div>
      </div>

      <div className="postTextContainer">
        <p className="postText">{post.postText}</p>
      </div>

      {post.postImage ? (
        <div className="postImageContainer">
          <img
            className="postImage"
            src={`http://localhost:5000/retrieve/${post.postImage}`}
            width="500px"
            alt="postImage"
          ></img>
        </div>
      ) : (
        console.log('')
      )}

      <form onSubmit={handleCommentSubmit}>
        <div className="cLContainer">
          <FavoriteIcon
            onClick={handleChangeHeartColor}
            fontSize="large"
            sx={{ color: colorOfHeart }}
          ></FavoriteIcon>
          <input
            onChange={handleCommentText}
            value={commentText}
            className="commentField"
            type="text"
            placeholder="Write your Comment"
          ></input>
        </div>

        <div className="commentButtonContainer">
          <button
            type="button"
            onClick={handleChangeInViewComments}
            className="commentButton"
          >
            View Comments
          </button>
          <button type="submit" className="commentButton" type="submit">
            <b>Comment</b>
          </button>
        </div>
      </form>

      {showComments
        ? comments.map((comment) => (
            <Comment key={comments.commentID} comment={comment} />
          ))
        : console.log('')}
    </div>
  );
});

export default Post;

// #e5d9b7
// #804FC0
// userID, postID, liked
