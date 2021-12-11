import React, { useEffect, useState } from 'react'
import Navbar from './NavBar';
import Post from './Post';
import SideBar from './SideBar';
import MultiPurpose from './MultiPurpose';
import './HomePage.css'
import { useStateValue } from '../../State/StateProvider';
import axios from 'axios';

const HomePage = () => {
    const [{ user }, dispatch] = useStateValue()
    const [posts, setPosts] = useState([])

    useEffect(async () => {
          console.log(user)
          const res = await axios.get(`http://localhost:5000/get/post/${user.uid}`)
          if (posts.length === 0) {setPosts(posts.concat(res.data.results))}
    }, [])
    
    return (
      <React.Fragment>
      <Navbar/>
      <div style={{backgroundColor: '#F8F2FF'}}>
      <div className='main'>
        <div className='sidebar'><SideBar/></div>
        <div className='posts'>
          {
            posts.map((post) => (
                <Post
                    key={post.postID}
                    post = {post}
                />
            ))
          }
        </div>
        <div className='multi'>
        <MultiPurpose posts={posts} setPosts={setPosts}/>
        </div>
      </div>
      </div>
      </React.Fragment>
    )
};

export default HomePage;