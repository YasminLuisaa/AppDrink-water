import React, { useContext, useEffect, useState } from 'react';
import { Text, HStack, View, Button, Box, VStack, useToast, Heading, Icon, Pressable} from 'native-base';
import { Animated } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../contexts/fireBaseConfig';
import { onAuthStateChanged } from "firebase/auth";

export const DashboardScreen: React.FC = () => {
    // Obtém o contexto do usuário
    const userContext = useContext(UserContext);

    // 🚨 Verifica se o contexto foi carregado corretamente
    if (!userContext) {
        console.error("🚨 Erro: UserContext não foi encontrado.");
        return null;
    }

    const { goal: userGoal } = userContext;
    const goal = userGoal ?? 0; // Garante que 'goal' sempre tenha um valor válido

    const [cupSize, setCupSize] = useState<number>(300);
    const [water, setWater] = useState<number>(0);
    const [progress] = useState(new Animated.Value(0));
    const toast = useToast();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
                await loadProgress(user.uid);
            } else {
                setUserId(null);
                setWater(0);
            }
        });

        return () => unsubscribe();
    }, []);

    // Carrega progresso salvo do usuário
    const loadProgress = async (userId: string) => {
        try {
            const savedProgress = await AsyncStorage.getItem(`waterProgress_${userId}`);
            if (savedProgress) {
                const progressValue = parseInt(savedProgress, 10);
                setWater(progressValue);
                progress.setValue(progressValue / goal);
            } else {
                setWater(0);
                progress.setValue(0);
            }
        } catch (error) {
            console.error("❌ Erro ao carregar progresso:", error);
        }
    };

    // Salva progresso no AsyncStorage
    const saveProgress = async (userId: string, progressValue: number) => {
        try {
            await AsyncStorage.setItem(`waterProgress_${userId}`, progressValue.toString());
        } catch (error) {
            console.error("❌ Erro ao salvar progresso:", error);
        }
    };

    // Salva histórico de consumo no AsyncStorage
    const saveConsumptionHistory = async (userId: string, amount: number) => {
        try {
            const historyKey = `waterHistory_${userId}`;
            const existingHistory = await AsyncStorage.getItem(historyKey);
            const historyArray = existingHistory ? JSON.parse(existingHistory) : [];

            const newEntry = {
                value: amount,
                date: new Date().toISOString()
            };

            historyArray.push(newEntry);
            await AsyncStorage.setItem(historyKey, JSON.stringify(historyArray));
        } catch (error) {
            console.error("❌ Erro ao salvar histórico de consumo:", error);
        }
    };

    // Manipula ação de beber água
    const handleWater = async () => {
        const newWater = water + cupSize;
        setWater(newWater);
        toast.show({ description: `Você bebeu ${cupSize}ml de água`, duration: 2000 });

        Animated.timing(progress, {
            toValue: newWater / goal,
            duration: 500,
            useNativeDriver: false,
        }).start();

        if (userId) {
            await saveProgress(userId, newWater);
            await saveConsumptionHistory(userId, cupSize);
        }
    };

    const handleChangeCupSize = (size: number) => {
        setCupSize(size);
    };

    useEffect(() => {
        if (water >= goal && goal > 0) {
            toast.show({
                description: "Parabéns! Você atingiu sua meta de hidratação! 🎉",
                placement: "top",
                colorScheme: "success",
                duration: 3000,
            });
        }
    }, [water]);

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <VStack flex={1} justifyContent="center" alignItems="center" p={6} bg="blue.50">
            <Box bg="white" p={8} rounded="3xl" shadow={6} w="95%" maxW="400px" alignItems="center">
                <Heading fontSize="3xl" mb={6} color="blue.900" fontWeight="extrabold" textAlign="center">
                    💧 Hidratação Diária
                </Heading>

                <VStack alignItems="center" space={6} w="100%">
                    <Box w="100%" position="relative">
                        <Text fontSize="lg" color="gray.600" mb={2} textAlign="center">
                            {water}ml / {goal}ml
                        </Text>
                        <Box bg="gray.100" rounded="full" h={3} w="100%" overflow="hidden">
                            <Animated.View
                                style={{
                                    height: '100%',
                                    width: progressWidth,
                                    backgroundColor: '#3B82F6',
                                    borderRadius: 999,
                                }}
                            />
                        </Box>
                    </Box>

                    <Pressable
                        onPress={handleWater}
                        bg="blue.600"
                        p={4}
                        rounded="2xl"
                        w="100%"
                        alignItems="center"
                        justifyContent="center"
                        shadow={3}
                        _pressed={{ opacity: 0.8 }}
                    >
                        <HStack space={2} alignItems="center">
                            <Icon as={MaterialIcons} name="local-drink" size="lg" color="white" />
                            <Text fontSize="xl" color="white" fontWeight="bold">
                                Beber Água
                            </Text>
                        </HStack>
                    </Pressable>
                </VStack>
            </Box>

            <Box mt={8} w="95%" maxW="400px" bg="white" p={6} rounded="3xl" shadow={6}>
                <Heading fontSize="xl" mb={4} color="gray.700" fontWeight="bold" textAlign="center">
                    Escolha o Recipiente
                </Heading>
                <VStack space={4}>
                    {[{ size: 200, label: 'Copo Americano' }, { size: 350, label: 'Xícara' }, { size: 500, label: 'Garrafa' }].map((item, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleChangeCupSize(item.size)}
                            bg={cupSize === item.size ? 'blue.100' : 'gray.100'}
                            p={4}
                            rounded="2xl"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            _pressed={{ opacity: 0.8 }}
                        >
                            <Text fontSize="lg" color="gray.700" fontWeight="medium">
                                {item.label} - {item.size}ml
                            </Text>
                        </Pressable>
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
};