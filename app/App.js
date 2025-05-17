import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./navigators/StackNav";
import client from "./config/apollo";
import { ApolloProvider } from "@apollo/client";
import AuthProvider from "./contexts/Auth";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <StackNav />
        </NavigationContainer>
      </ApolloProvider>
    </AuthProvider>
  );
}
