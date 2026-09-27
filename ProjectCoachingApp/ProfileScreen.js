import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        navigation.replace('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile & Settings</Text>
            
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
