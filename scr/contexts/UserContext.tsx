import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./fireBaseConfig"; // Importação da configuração do Firebase

interface IUserContext {
  user: User | null;
  goal: number;
  setGoal: (value: number) => void;
}

export const UserContext = createContext<IUserContext | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [goal, setGoal] = useState<number>(2000); // Meta padrão de 2000ml

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, goal, setGoal }}>
      {children}
    </UserContext.Provider>
  );
};
