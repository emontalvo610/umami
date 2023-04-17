import React from 'react';
import styles from './PageHeader.module.css';

export default function PageHeader({ title, children }) {
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}
