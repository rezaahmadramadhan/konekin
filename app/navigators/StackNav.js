import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TabNav from "./TabNav";
import DetailScreen from "../screens/DetailScreen";
import { Image } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../contexts/Auth";
const Stack = createNativeStackNavigator();

export default function StackNav() {
  const { isLogin } = useContext(AuthContext);

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
      {isLogin ? (
        <>
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
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
