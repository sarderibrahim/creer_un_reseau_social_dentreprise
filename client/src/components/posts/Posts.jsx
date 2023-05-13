import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Post from '../post/Post';
import classes from './posts.module.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/post/timeline/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        // sort posts by creation time in descending order
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // reverse the order of the array to display posts in anti-clockwise order
        setPosts([...data].reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className={classes.container}>
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
