import { NavigationContainer } from "@react-navigation/native";
import StackNav from "./navigators/StackNav";

export default function App() {
  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}
