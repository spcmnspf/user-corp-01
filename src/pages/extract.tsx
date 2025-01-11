import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement } from 'react';
import styles from '../styles/extractPortal.module.css';


function ExtractPage() {
  return (
    
    <div className={styles.container}>
    </div>
  );
}

ExtractPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout title="Extract">{page}</BaseLayout>;
};

export default ExtractPage;