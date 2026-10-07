import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Fake login: any non-empty username/password is accepted.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => sessionStorage.getItem('pos-user'));

  const login = (username) => {
    sessionStorage.setItem('pos-user', username);
    setUser(username);
  };

  const logout = () => {
    sessionStorage.removeItem('pos-user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
