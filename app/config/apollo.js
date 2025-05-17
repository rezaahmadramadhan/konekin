import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { getValueSecure } from '../helpers/secureStore';

// Create a basic HTTP link
const httpLink = createHttpLink({
  uri: "http://10.0.2.2:3000/",  // Using 10.0.2.2 which points to host machine's localhost from Android emulator
});

// Add authentication to the request headers
const authLink = setContext(async (_, { headers }) => {
  // Get the token from secure storage
  const token = await getValueSecure('token');
  
  // Return the headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
