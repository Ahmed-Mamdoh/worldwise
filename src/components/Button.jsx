import styles from "./Button.module.css";

function Button({ children, onClick, type = "primary" }) {
  return (
    <div>
      <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
        {children}
      </button>
    </div>
  );
}

export default Button;
