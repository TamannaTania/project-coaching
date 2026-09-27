import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            const name = await AsyncStorage.getItem('username');
            if(name) setUsername(name);
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                <Ionicons name="person" size={60} color="#1a9c5c" />
            </View>
            <Text style={styles.text}>Welcome, {username || 'Student'}!</Text>
            
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Text style={styles.logoutBtnText}>Logout</Text>
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
