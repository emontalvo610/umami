import { useState } from 'react';
import { Loading, cloneChildren } from 'react-basics';
import ErrorMessage from 'components/common/ErrorMessage';
import { formatLongNumber, formatNumber } from 'lib/format';
import styles from './MetricsBar.module.css';

export function MetricsBar({ children, isLoading, isFetched, error }) {
  const [format, setFormat] = useState(true);

  const formatFunc = format
    ? n => (n >= 0 ? formatLongNumber(n) : `-${formatLongNumber(Math.abs(n))}`)
    : formatNumber;

  const handleSetFormat = () => {
    setFormat(state => !state);
  };

  return (
    <div className={styles.bar} onClick={handleSetFormat}>
      {isLoading && !isFetched && <Loading icon="dots" />}
      {error && <ErrorMessage />}
      {!isLoading &&
        !error &&
        isFetched &&
        cloneChildren(children, child => {
          return { format: child.props.format || formatFunc };
        })}
    </div>
  );
}

export default MetricsBar;
