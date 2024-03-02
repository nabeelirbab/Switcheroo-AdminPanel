import { Helmet } from 'react-helmet-async';

import { ReportedUserView } from 'src/sections/Reported-user/view';


// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Reported Users </title>
      </Helmet>

      <ReportedUserView />
    </>
  );
}
