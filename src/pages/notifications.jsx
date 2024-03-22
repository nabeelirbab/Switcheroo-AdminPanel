import { Helmet } from 'react-helmet-async';

import { NotificationView } from 'src/sections/Notifications';

// ----------------------------------------------------------------------

export default function TotalItems() {
  return (
    <>
      <Helmet>
        <title> Notifications </title>
      </Helmet>

      <NotificationView />
    </>
  );
}
