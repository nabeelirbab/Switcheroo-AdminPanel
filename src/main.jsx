import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import App from './app';

// ----------------------------------------------------------------------

const client = new ApolloClient({
  uri: 'https://backendtest.switcherooapp.com/',
  credentials:'include',
  cache: new InMemoryCache(),
});

console.log(client,'....')

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </ApolloProvider>
);
