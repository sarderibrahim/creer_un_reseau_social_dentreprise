import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePost } from '../../redux/authSlice';

const UpdatePost = ({ post, setShowUpdateModal }) => {
  const [desc, setDesc] = useState(post.desc);
  const [location, setLocation] = useState(post.location);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPost = {
      ...post,
      desc,
      location,
    };

    dispatch(updatePost(updatedPost));

    setShowUpdateModal(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="desc">Description:</label>
          <input
            type="text"
            id="desc"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePost;
