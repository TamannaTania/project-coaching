import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE } from './config';

export default function ProfileScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const name = await AsyncStorage.getItem('username');
            if(name) setUsername(name);
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const email = await AsyncStorage.getItem('email');
            
            // Call server logout to clear DeviceId in database
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('username');
            await AsyncStorage.removeItem('email');
            setLoggingOut(false);
            
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                <Ionicons name="person" size={60} color="#0284c7" />
            </View>
            <Text style={styles.text}>Welcome, {username || 'Student'}!</Text>
            
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} disabled={loggingOut}>
                {loggingOut ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.logoutBtnText}>Logout</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e6f7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 30,
    },
    logoutBtn: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    logoutBtnText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
