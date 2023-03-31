import { Row, Column, Text } from 'react-basics';
import Favicon from 'components/common/Favicon';
import ActiveUsers from './ActiveUsers';
import styles from './WebsiteHeader.module.css';

export default function WebsiteHeader({ websiteId, name, domain, children }) {
  return (
    <Row className={styles.header} justifyContent="center">
      <Column className={styles.name} variant="two">
        <Favicon domain={domain} />
        <Text>{name}</Text>
      </Column>
      <Column className={styles.body} variant="two">
        <ActiveUsers websiteId={websiteId} />
        {children}
      </Column>
    </Row>
  );
}
