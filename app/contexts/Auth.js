import { createContext, useEffect, useState } from "react";
import { getValueSecure } from "../helpers/secureStore";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);

  const checkToken = async () => {
    const token = await getValueSecure("token");
    if (token) setIsLogin(true);
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
