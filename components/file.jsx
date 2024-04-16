import { Link } from "react-router-dom";
import styles from "../src/pagestyles.module.css"
function File(props){
    let date = new Date(props.date);
    if(!props.onClick){
      return (
        <Link className={[styles.rows, styles.dimOnHover].join(" ")} style={{cursor:"pointer", color:"black"}} to={"/file/"+props.id+"?admin=false"}>
            <p className={styles.emP}>{props.name}</p>
            <p>
                <i>{date.toLocaleDateString()} {date.toLocaleTimeString()}</i>
            </p>
        </Link>
      )
    } else {
      return (
        <div className={[styles.rows, styles.dimOnHover].join(" ")} style={{cursor:"pointer", color:"black"}} onClick={()=>{props.onClick({id:props.id,name:props.name})}}>
            <p className={styles.emP}>{props.name}</p>
            <p>
                <i>{date.toLocaleDateString()} {date.toLocaleTimeString()}</i>
            </p>
        </div>
      )
    }
      
  }

  export default File