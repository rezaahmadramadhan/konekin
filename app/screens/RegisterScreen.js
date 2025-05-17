import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";

const REGISTER = gql`
  mutation Register($name: String, $username: String, $email: String, $password: String) {
    register(name: $name, username: $username, email: $email, password: $password)
  }
`;

export default function RegisterScreen() {  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [doRegister, { loading }] = useMutation(REGISTER);
  
  const handleRegister = async () => {
    try {
      if (!name || !username || !email || !password) {
        Alert.alert("Registration Error", "Please fill in all fields");
        return;
      }

      if (!email.includes("@")) {
        Alert.alert("Registration Error", "Please enter a valid email address");
        return;
      }

      if (password.length < 5) {
        Alert.alert("Registration Error", "Password must be at least 5 characters");
        return;
      }

      const result = await doRegister({
        variables: {
          name,
          username,
          email,
          password,
        },
      });

      if (result.data.register === "Register Success") {
        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully. Please login.",
          [{ text: "Login", onPress: () => navigation.navigate("Login") }]
        );
      }
    } catch (error) {
      Alert.alert("Registration Error", error.message || "An unknown error occurred");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Image
              source={{
                uri: "https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg",
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Join KonekIn</Text>
            <Text style={styles.subtitle}>
              Make the most of your professional life
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Create a password (5+ characters)"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#0073b1"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.termsText}>
              By clicking Join, you agree to the KonekIn User Agreement, Privacy Policy, and Cookie Policy.
            </Text>

            <TouchableOpacity 
              style={styles.joinButton} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.joinButtonText}>
                {loading ? "Registering..." : "Join"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already on KonekIn?{" "}
              <Text
                style={styles.signInText}
                onPress={() => navigation.navigate("Login")}
              >
                Sign in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 100,
    height: 24,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 4,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: "#0073b1",
    borderRadius: 24,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  signInText: {
    color: "#0073b1",
    fontWeight: "600",
  },
});
