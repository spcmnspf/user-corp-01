import BaseLayout from '@/layouts/BaseLayout';
import { ReactElement } from 'react';
import CyberpunkPortal from '../components/hackPortal';
import styles from '../styles/hackPortal.module.css';

function HackPage() {
  return (
      <CyberpunkPortal />
  );
}

HackPage.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout title="Hack">{page}</BaseLayout>;
};

export default HackPage;