import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TabNav from "./TabNav";
import DetailScreen from "../screens/DetailScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import { Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../contexts/Auth";
const Stack = createNativeStackNavigator();

export default function StackNav() {
  const { isLogin } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#0077b5",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      {isLogin ? (
        <>
          <Stack.Screen
            name="Home"
            options={{
              title: "KonekIn",
              headerShown: false,
            }}
            component={TabNav}
          />
          <Stack.Screen
            name="Detail"
            options={({ route, navigation }) => ({
              title: "Post",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
              ),
            })}
            component={DetailScreen}
          />
          <Stack.Screen
            name="CreatePost"
            options={({ navigation }) => ({
              title: "Create Post",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
              ),
            })}
            component={CreatePostScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#0077b5",
  },
});
