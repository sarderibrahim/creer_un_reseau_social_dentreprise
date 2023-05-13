import React from 'react'
import Posts from '../posts/Posts'
import ProfileCard from '../profileCard/ProfileCard'
import SuggestedUsers from '../suggestedUsers/SuggestedUsers'
import classes from './home.module.css'

const Home = () => {
  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <ProfileCard />
        <SuggestedUsers />
      </div>
      <div className={classes.center}>
      <Posts />
      </div>
      
    </div>
  )
}

export default Home