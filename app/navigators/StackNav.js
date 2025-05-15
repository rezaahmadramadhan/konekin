import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TabNav from "./TabNav";
import DetailScreen from "../screens/DetailScreen";
import HomeListScreen from "../screens/HomeListScreen";
const Stack = createNativeStackNavigator();

export default function StackNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Home"
        options={{ title: "Welcome", headerShown: false }}
        component={TabNav}
      />
      <Stack.Screen
        name="Detail"
        options={({ route }) => ({
          title: route.params.content,
        })}
        component={DetailScreen}
      />
    </Stack.Navigator>
  );
}
