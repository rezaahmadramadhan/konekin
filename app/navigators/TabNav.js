import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NetworkScreen from "../screens/NetworkScreen";
import { Text, View, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  let iconSymbol = "";
  let label = "";
  const navigation = useNavigation();

  switch (name) {
    case "home":
      iconSymbol = <Ionicons name="home" size={24} color="black" />;
      label = "Home";
      break;
    case "network":
      iconSymbol = <Ionicons name="people-sharp" size={24} color="black" />;
      label = "Network";
      break;
    case "post":
      iconSymbol = <Entypo name="squared-plus" size={24} color="black" />;
      label = "Post";
      break;
    case "notifications":
      iconSymbol = <Ionicons name="notifications" size={24} color="black" />;
      label = "Notif";
      break;
    case "jobs":
      iconSymbol = <Ionicons name="briefcase" size={24} color="black" />;
      label = "Jobs";
      break;
    case "profile":
      iconSymbol = <Ionicons name="person" size={24} color="black" />;
      label = "Profile";
      break;
    default:
      iconSymbol = <Ionicons name="help-circle" size={24} color="black" />;
      label = "Unknown";
  }

  return (
    <View style={styles.tabContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {iconSymbol}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label}
      </Text>
    </View>
  );
};

export default function TabNav() {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#0077b5",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="MyNetwork"
        component={NetworkScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="network" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Post"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="post" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("CreatePost");
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="notifications" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Alert.alert("Info", "Notifications feature coming soon!");
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="profile" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 1,
  },
  tabIconFocused: {
    color: "#0077b5",
  },
  tabLabel: {
    fontSize: 10,
    color: "#666",
    width: 40,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  tabLabelFocused: {
    color: "#0077b5",
    fontWeight: "bold",
  },
});
