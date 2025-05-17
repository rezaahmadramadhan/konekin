import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Text, View, StyleSheet, Alert } from "react-native";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  let iconSymbol = "";
  let label = "";

  switch (name) {
    case "home":
      iconSymbol = "🏠";
      label = "Home";
      break;
    case "network":
      iconSymbol = "👥";
      label = "Network";
      break;
    case "post":
      iconSymbol = "➕";
      label = "Post";
      break;
    case "notifications":
      iconSymbol = "🔔";
      label = "Notifications";
      break;
    case "jobs":
      iconSymbol = "💼";
      label = "Jobs";
      break;
    case "profile":
      iconSymbol = "👤";
      label = "Profile";
      break;
    default:
      iconSymbol = "❓";
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
        name="HomeList"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="MyNetwork"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="network" focused={focused} />,
          tabBarLabel: () => null,
        }}        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Alert.alert('Info', 'Network feature coming soon!');
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="post" focused={focused} />,
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Alert.alert('Info', 'Post creation feature coming soon!');
          },
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="notifications" focused={focused} />,
          tabBarLabel: () => null,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            Alert.alert('Info', 'Notifications feature coming soon!');
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 3,
  },
  tabIconFocused: {
    color: '#0077b5',
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
  },
  tabLabelFocused: {
    color: '#0077b5',
    fontWeight: 'bold',
  },
});
