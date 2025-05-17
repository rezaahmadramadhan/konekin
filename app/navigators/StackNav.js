import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TabNav from "./TabNav";
import DetailScreen from "../screens/DetailScreen";
import { Image } from "react-native";
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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: () => (
            <Image
              source={{
                uri: "https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg",
              }}
              style={{ width: 100, height: 24 }}
              resizeMode="contain"
            />
          ),
          headerStyle: { backgroundColor: "white" },
          // headerShown: false,
        }}
      />
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
