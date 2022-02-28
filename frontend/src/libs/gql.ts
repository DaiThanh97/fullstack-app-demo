import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { API_HOST } from './constants';
import { AppDispatch } from '../store/store';
import { onError } from '@apollo/client/link/error';
import { showErrorToast } from './toast';

export const getClient = (dispatch: AppDispatch) => {
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `thisisrandomauthtoken`,
      },
    };
  });

  const httpLink = createHttpLink({
    uri: API_HOST + '/data',
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions?.code) {
          case 'INTERNAL_SERVER_ERROR': {
            showErrorToast(`Oops. Something went wrong: ${err.message}`, {
              autoClose: false,
            });
            break;
          }
        }
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false,
    }),
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    connectToDevTools: true,
  });
};
