import { createContext, useEffect, useState } from "react";
import { getMe } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {

      try {

        if (token) {

          const data = await getMe();

          setUser(data);

        }

      } catch (err) {

        console.log(err);

        localStorage.removeItem("token");

        setToken(null);

        setUser(null);

      } finally {

        setLoading(false);

      }

    };

    fetchUser();

  }, [token]);

  const loginUser = (jwtToken) => {

    localStorage.setItem("token", jwtToken);

    setToken(jwtToken);

  };

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}