import { createContext, useEffect, useState } from "react";
// import  from 'expo-secure-store';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
const checkToken = async () => {
    const token = await getVal
}

  useEffect(() => {
    
  })
}
