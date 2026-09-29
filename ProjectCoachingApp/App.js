import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import MyCoursesScreen from './MyCoursesScreen';
import ProfileScreen from './ProfileScreen';
import CourseDetailsScreen from './CourseDetailsScreen';
import VideoPlayerScreen from './VideoPlayerScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Mobile Bottom Tabs ---
function MobileMainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'MyCourses') iconName = focused ? 'play-circle' : 'play-circle-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a9c5c',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ title: 'My Courses' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- Web Top Navbar Component ---
function WebNavbar({ navigation, state }) {
  const currentRoute = state ? state.routes[state.index].name : 'Home';
  
  const navItems = [
    { name: 'Home', label: 'Home', icon: 'home' },
    { name: 'MyCourses', label: 'My Courses', icon: 'play-circle' },
    { name: 'Profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <View style={styles.webNavbar}>
      <View style={styles.navContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={28} color="#1a9c5c" />
          <Text style={styles.logoText}>PhysicsAcademy</Text>
        </View>

        <View style={styles.navLinks}>
          {navItems.map((item) => (
            <TouchableOpacity 
              key={item.name} 
              style={[styles.navLink, currentRoute === item.name && styles.activeNavLink]}
              onPress={() => navigation.navigate(item.name)}
            >
              <Ionicons name={item.icon} size={18} color={currentRoute === item.name ? '#1a9c5c' : '#4b5563'} style={{marginRight: 6}} />
              <Text style={[styles.navText, currentRoute === item.name && styles.activeNavText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

// --- Web Main Stack (With Top Navbar) ---
const WebStack = createNativeStackNavigator();
function WebMainStack() {
  return (
    <WebStack.Navigator
      screenOptions={{
        header: (props) => <WebNavbar {...props} />
      }}
    >
      <WebStack.Screen name="Home" component={HomeScreen} />
      <WebStack.Screen name="MyCourses" component={MyCoursesScreen} />
      <WebStack.Screen name="Profile" component={ProfileScreen} />
    </WebStack.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setInitialRoute('Main');
        }
      } catch (e) {}
      setIsReady(true);
    };
    checkLogin();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a9c5c" />
      </View>
    );
  }

  // Choose layout based on platform
  const MainComponent = Platform.OS === 'web' ? WebMainStack : MobileMainTabs;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          
          {/* Main Layout (Web = Top Nav, Mobile = Bottom Tabs) */}
          <Stack.Screen name="Main" component={MainComponent} />
          
          {/* Global Screens (Hide navbar/tabs when open) */}
          <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webNavbar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  navContainer: {
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 10,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeNavLink: {
    backgroundColor: '#f0fdf4',
  },
  navText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  activeNavText: {
    color: '#1a9c5c',
  }
});
