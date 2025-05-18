import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { getValueSecure } from '../helpers/secureStore';
import { Platform } from 'react-native';

// const getServerUrl = () => {
//   if (__DEV__) {
//     if (Platform.OS === 'android') {
//       return 'http://10.0.2.2:3000/';
//     }
//     return 'http://localhost:3000/';
//   }
//   return 'https://gc01.dhronz.space/';
// };

const httpLink = createHttpLink({
  uri: 'https://gc01.dhronz.space/', 
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getValueSecure('token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Post: {
        keyFields: ["_id"],
        fields: {
          likes: {
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      },
      User: {
        keyFields: ["_id"],
        fields: {
          userFollowers: {
            merge(existing = [], incoming) {
              return incoming;
            }
          },
          userFollowings: {
            merge(existing = [], incoming) {
              return incoming;
            }
          }
        }
      }
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-and-network',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

export default client;
