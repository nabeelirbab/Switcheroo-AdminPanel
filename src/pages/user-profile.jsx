import { Helmet } from 'react-helmet-async';

import { UserProfileView } from 'src/sections/UserProfile/View/index';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User Profile </title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
