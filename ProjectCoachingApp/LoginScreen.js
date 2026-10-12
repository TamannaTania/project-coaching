import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace 5270 with your actual API port (from launchSettings.json / backend terminal)
import { API_BASE } from './config';
const API_URL = API_BASE + '/auth/login';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            // Generating a random device ID for the mobile app
            let deviceId = await AsyncStorage.getItem('deviceId');
            if (!deviceId) {
                deviceId = 'mobile-' + Math.random().toString(36).substring(2, 15);
                await AsyncStorage.setItem('deviceId', deviceId);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, deviceId })
            });

            if (response.ok) {
                const data = await response.json();
                await AsyncStorage.setItem('token', data.token || data.Token);
                await AsyncStorage.setItem('username', data.username || data.Username);
                
                // Navigate to Home screen
                navigation.replace('Main');
            } else {
                const errorText = await response.text();
                console.log("SERVER ERROR:", errorText);
                alert('Login Failed: ' + errorText);
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Cannot connect to server. Ensure your C# API is running on ' + API_URL);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>🎯 P-Coaching</Text>
                <Text style={styles.subtitle}>Student App Login</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="student@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#38bdf8',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 5,
    },
    form: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        fontSize: 15,
        backgroundColor: '#f8fafc',
    },
    loginButton: {
        backgroundColor: '#0284c7',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
