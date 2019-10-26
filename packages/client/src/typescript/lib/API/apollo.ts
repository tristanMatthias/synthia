import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
import { API_URL } from '../../config';

import introspectionQueryResultData from '@synthia/api/schema/fragmentTypes.json';

export const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData
    })
  }),
  link: createUploadLink({
    uri: `${API_URL}/graphql`
  })
})
