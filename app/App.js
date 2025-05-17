import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./navigators/StackNav";
import client from "./config/apollo";
import { ApolloProvider } from "@apollo/client";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
    </ApolloProvider>
  );
}
