import { createContext, useEffect, useState } from "react";
import { getValueSecure, deleteValueSecure } from "../helpers/secureStore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  const checkToken = async () => {
    const token = await getValueSecure("token");
    if (token) setIsLogin(true);
  };

  const logout = async () => {
    try {
      await deleteValueSecure("token");
      setIsLogin(false);
      setUserData(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
