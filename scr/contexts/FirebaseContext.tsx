import React, { createContext, useEffect, useState } from "react";
import { Center, Spinner, Text } from "native-base";

export interface IFirebaseContext {
    loading: boolean;
}

interface IFirebaseProvider {
    children: React.ReactNode;
}

export const FirebaseContext = createContext<IFirebaseContext | null>(null);

export const FirebaseProvider: React.FC<IFirebaseProvider> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulação de inicialização (ex: verificar autenticação)
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 3000); // Reduzi para 3 segundos para um melhor UX

        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return (
            <Center flex={1}>
                <Spinner size="lg" />
                <Text mt={1}>Carregando...</Text>
            </Center>
        );
    }

    return (
        <FirebaseContext.Provider value={{ loading }}>
            {children}
        </FirebaseContext.Provider>
    );
};
