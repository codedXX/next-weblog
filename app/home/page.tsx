import styles from './index.module.scss'
const home=()=>{
    return (
       <div className={styles.mainBox}>
        <div className={styles.header}>
           <div className={styles.title}>
            codeYx的前端游乐场
           </div>
           <div className={styles.tagList}>
            <div className={styles.tag}>
                概述
                
            </div>
           </div>
        </div>
       </div>
    )
}

export default home