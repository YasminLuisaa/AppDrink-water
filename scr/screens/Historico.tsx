import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Box, Text, View } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../contexts/fireBaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

export const Historico: React.FC = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                setUserId(user.uid);
                await loadHistory(user.uid);
            } else {
                setUserId(null);
                setHistory([]);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            const interval = setInterval(() => loadHistory(userId), 3000); // Atualiza a cada 3 segundos
            return () => clearInterval(interval);
        }
    }, [userId]);

    const loadHistory = async (userId: string) => {
        try {
            const waterHistory = await AsyncStorage.getItem(`waterHistory_${userId}`);
            const parsedHistory = waterHistory ? JSON.parse(waterHistory) : [];

            const sortedHistory = parsedHistory.sort((a: { date: string }, b: { date: string }) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setHistory(sortedHistory);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Box p={4} w="100%">
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4} color="blue.700">
                    Histórico de Consumo 💧
                </Text>

                {history.length === 0 ? (
                    <Text textAlign="center" color="gray.500" fontSize="md">
                        Nenhum consumo registrado ainda.
                    </Text>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {history.map((item, index) => (
                            <Box key={index} style={styles.card}>
                                <Text fontSize="lg" fontWeight="bold" color="blue.800">
                                    {item.value}ml
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    {new Date(item.date).toLocaleString()}
                                </Text>
                            </Box>
                        ))}
                    </ScrollView>
                )}
            </Box>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f4f8",
    },
    scrollContainer: {
        paddingBottom: 20,
        alignItems: "center",
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        paddingHorizontal: 60,
        paddingVertical: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
    },
});