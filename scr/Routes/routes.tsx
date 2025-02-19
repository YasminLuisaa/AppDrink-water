import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "native-base";
import Icon from "react-native-vector-icons/AntDesign";
import { NavigationContainer } from "@react-navigation/native";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import {Historico } from "../screens/Historico";

type ITabRoutes = {
  Dashboard: undefined;
  Profile: undefined;
  Historic: undefined;
};

const Tab = createBottomTabNavigator<ITabRoutes>();

export const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Profile"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "purple",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#fff",
            paddingBottom: 5,
          },
        }}
      >
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => <Icon name="dashboard" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Historic"
          component={Historico}
          options={{
            title: "Historic",
            tabBarIcon: ({ color, size }) => <Icon name="clockcircleo" size={size} color={color} />, // Ícone corrigido
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};