import { Helmet } from 'react-helmet-async';

import { ItemsView } from 'src/sections/Reported-items/view/index'

// ----------------------------------------------------------------------

export default function TotalItems() {
  return (
    <>
      <Helmet>
        <title> Total Items </title>
      </Helmet>

      <ItemsView />
    </>
  );
}
