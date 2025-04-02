import React from "react";
import { useLoading } from "@/context/LoadingContext";
import styles from "../assets/scss/LoadingSpinner.module.scss"; // Importa o SCSS como módulo

const LoadingSpinner = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className={styles["loading-overlay"]}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default LoadingSpinner;