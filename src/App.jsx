import { useState } from 'react'
import Navbar from '../components/navbar/nav';
import styles from "./pagestyles.module.css"
import { Button } from '@mui/material';

function App() {
  return (
    <>
      <Navbar admin={true}/>
      <div className={styles.body} style={{paddingTop:"10vh"}}>
        <h1>Hello Bryson!</h1>
        <div className={styles.popout} style={{textAlign:"left"}}>
          <p>Email: email@email.com</p>
          <p>User ID: sldkfjwoeiurjsdjflwlskdjflsdfkj (Click to Copy)</p>
          <p>Status: Administrator</p>
          <Button variant="contained">Sign Out</Button>
        </div>
      </div>
    </>
  )
}

export default App;
