import { useContext, useState } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../contexts/Auth";
import { saveSecure } from "../helpers/secureStore";

const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      access_token
    }
  }
`;

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { setIsLogin } = useContext(AuthContext);
  const [doLogin, { loading }] = useMutation(LOGIN);  const handleLogin = async () => {
    try {
      console.log("Sending login request...");
      const result = await doLogin({
        variables: {
          username,
          password,
        },
      });

      const token = result.data.login.access_token;
      if (!token) throw new Error("Invalid token from server");

      await saveSecure("token", token);
      setIsLogin(true);
    } catch (error) {
      Alert.alert("Login Error", error.message || "An unknown error occurred");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
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
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>
            Stay updated on your professional world
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              keyboardType="default"
              autoCapitalize="none"
              placeholder="username"
              autoFocus={false}
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
                placeholder="Password"
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

          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.signInButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New to KonekIn?
            <Text
              style={styles.signUpText}
              onPress={() => navigation.navigate("Register")}
            >
              Join now
            </Text>
          </Text>
        </View>
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
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  forgotPassword: {
    color: "#0073b1",
    fontWeight: "600",
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#0073b1",
    borderRadius: 24,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  orText: {
    marginHorizontal: 10,
    color: "#666",
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  signUpText: {
    color: "#0073b1",
    fontWeight: "600",
  },
});
