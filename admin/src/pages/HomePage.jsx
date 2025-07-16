import { Main } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main style={{height: '98vh'}}>
      <iframe src="/red" style={{border:0}} height="100%" width="100%"></iframe>
    </Main>
  );
};

export { HomePage };
