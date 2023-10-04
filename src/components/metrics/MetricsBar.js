import { Loading, cloneChildren } from 'react-basics';
import ErrorMessage from 'components/common/ErrorMessage';
import { formatLongNumber } from 'lib/format';
import styles from './MetricsBar.module.css';

export function MetricsBar({ children, isLoading, isFetched, error }) {
  const formatFunc = n => (n >= 0 ? formatLongNumber(n) : `-${formatLongNumber(Math.abs(n))}`);

  return (
    <div className={styles.bar}>
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
