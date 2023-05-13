import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import woman from '../../assets/babra.jpg'
import  capitalizeFirstLetter  from '../../util/capitalizeFirstLetter'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { AiFillHeart,AiFillEdit, AiOutlineHeart,AiOutlineFileImage,AiOutlineClose } from 'react-icons/ai'
import { BiMessageRounded } from 'react-icons/bi'
import classes from './post.module.css'
import Comment from '../comment/Comment'
import { updatePost } from '../../redux/authSlice'


const Post = ({ post }) => {
  const { token, user } = useSelector((state) => state.auth)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id))
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showComment, setShowComment] = useState(false)
  const dispatch = useDispatch() 
  const [state, setState] = useState({})
  const [photo, setPhoto] = useState("")
  const [showModal, setShowModal] = useState(false)
const [showForm, setShowForm] = useState(false)
  const handleState = (e) => {
    setState(prev => {
     return {...prev, [e.target.name]: e.target.value}
    })
  }


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/comment/${post._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await res.json()
        setComments(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchComments()
  }, [post._id])

  const handleShowForm = () => {
    setShowForm(true)
    setShowModal(false)
  }

  const deletePost = async () => {
    try {
      await fetch(`http://localhost:5000/post/${post._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: 'DELETE'
      })
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLikePost = async () => {
    try {
      await fetch(`http://localhost:5000/post/toggleLike/${post._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "PUT"
      })
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  }


  const handlePostComment = async () => {
    if (commentText === '') {
      setIsCommentEmpty(true)
      setTimeout(() => {
        setIsCommentEmpty(false)
      }, 2000)
      return
    }

    try {
      const res = await fetch(`http://localhost:5000/comment`, {
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({ commentText, post: post._id })
      })

      const data = await res.json()

      setComments(prev => [...prev, data])
      setCommentText('')
    } catch (error) {
      console.error(error)
    }
  }
  const handleUpdatePost= async(e) => {
    e.preventDefault()
    let filename = null
    if(photo){
      const formData = new FormData()
      filename = crypto.randomUUID() + photo.name
      formData.append('filename', filename)
      formData.append('image', photo)
      
      await fetch(`http://localhost:5000/upload/image`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: formData
      })
    }
      
  
    try {
      const res = await fetch(`http://localhost:5000/post/${post._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: "PUT",
        body: JSON.stringify({...state, profileImg: filename})
      })
      
      const data = await res.json()
      setShowForm(false)
      dispatch(updatePost(data))
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.top}>
          <Link to={`/profileDetail/${post?.user?._id}`} className={classes.topLeft}>
            <img alt='' src={woman} className={classes.profileUserImg} />
            <div className={classes.profileMetadata}>
              <span>{capitalizeFirstLetter(post.user.username)}</span>
              <span>{format(post.createdAt)}</span>
            </div>
          </Link>
          {
            (user._id === post.user._id || user.isAdmin === true) &&
            <div className={classes.icons}>
            <HiOutlineDotsVertical size={25} onClick={() => setShowDeleteModal(prev => !prev)} />
            <button className={classes.editIcons} onClick={handleShowForm}><AiFillEdit/></button>
            </div>
}
            
{
          showForm &&
          <div className={classes.updateProfileForm} onClick={() => setShowForm(false)}>
            <div className={classes.updateProfileWrapper} onClick={(e) => e.stopPropagation()}>
              <h2>Update Profile</h2>
              <form onSubmit={handleUpdatePost}>
                <input type="text" placeholder='title' name="title" onChange={handleState} />
                <input type="text" placeholder='description' name="desc" onChange={handleState} />
                <input type="text" placeholder='Location' name="location" onChange={handleState} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                  <label htmlFor='photo'>Profile Picture <AiOutlineFileImage /></label>
                  <input
                    type="file"
                    id='photo'
                    placeholder='post picture'
                    style={{ display: 'none' }}
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                  {photo && <p>{photo.name}</p>}
                </div>
                <button>Update profile</button>
              </form>
              <AiOutlineClose onClick={() => setShowForm(false)} className={classes.removeIcon} />
            </div>
          </div>
        }
          {
            showDeleteModal && (
              <div className={classes.deleteModal}>
                <h3>Delete Post</h3>
                <div className={classes.buttons}>
                  <button onClick={deletePost}>Yes</button>
                  <button onClick={() => setShowDeleteModal(prev => !prev)}>No</button>
                </div>
              </div>
            )
          }
        </div>
        <div className={classes.center}>
          <div className={classes.desc}>{post.desc}</div>
          {post?.location && <div className={classes.location}>Location: {post.location}</div>}
          <img alt='' className={classes.postImg} src={post?.photo ? `http://localhost:5000/images/${post?.photo}` : woman} />
        </div>
        <div className={`${classes.controls} ${showComment && classes.showComment}`}>
          <div className={classes.controlsLeft}>
            {
              isLiked
                ? <AiFillHeart onClick={handleLikePost} />
                : <AiOutlineHeart onClick={handleLikePost} />
            }
            <BiMessageRounded onClick={() => setShowComment(prev => !prev)} />
          </div>
        </div>
        {
          showComment &&
          <>
            <div className={classes.comments}>
              {
                comments?.length > 0 ? comments.map((comment) => (
                  <Comment c={comment} key={comment._id} />
                )) : <span style={{ marginLeft: '12px', fontSize: '20px' }}>No comments</span>
              }
            </div>
            <div className={classes.postCommentSection}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text"
                className={classes.inputSection}
                placeholder='Type comment'
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
            {isCommentEmpty && <span className={classes.emptyCommentMsg}>You can't post empty comment!</span>}
          </>
        }
      </div>
    </div>
  )
}

export default Post
