import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://localhost:44307/api/Courses';

export default function HomeScreen({ navigation }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        loadUserData();
        fetchCourses();
    }, []);

    const loadUserData = async () => {
        const name = await AsyncStorage.getItem('username');
        if (name) setUsername(name);
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            Alert.alert('Error', 'Could not load courses. Check server connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        // Here we could also call the logout API, but for simplicity we'll just clear storage
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('username');
        // We MUST NOT remove deviceId, otherwise the DB will block subsequent logins
        navigation.replace('Login');
    };

    const renderCourseCard = ({ item }) => {
        let imageUrl = item.imageUrl || 'https://via.placeholder.com/400x200?text=Course';
        if (!imageUrl.startsWith('http')) {
            // Append a slash if needed
            const prefix = imageUrl.startsWith('/') ? '' : '/';
            imageUrl = 'https://localhost:44307' + prefix + imageUrl;
        }

        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}
                activeOpacity={0.9}
            >
                <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.courseImage} 
                    resizeMode="cover"
                />
                <View style={styles.cardContent}>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{item.badge || 'New'}</Text>
                    </View>
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    <Text style={styles.coursePrice}>৳ {item.price}</Text>
                    
                    <View style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>View Details</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Hello,</Text>
                    <Text style={styles.usernameText}>{username || 'Student'}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutBtnText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
                <Text style={styles.sectionTitle}>Available Courses</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#1a9c5c" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={courses}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCourseCard}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        alignItems: 'center', // Center everything on large screens
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a9c5c',
        padding: 20,
        paddingTop: 50, // for status bar
    },
    mainContent: {
        width: '100%',
        maxWidth: 600, // Makes it look like a phone on PC
        flex: 1,
    },
    welcomeText: {
        color: '#d1fae5',
        fontSize: 14,
    },
    usernameText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoutBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    logoutBtnText: {
        color: 'white',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        margin: 20,
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseImage: {
        width: '100%',
        aspectRatio: 16 / 9, // Keeps standard video/cover proportion
        backgroundColor: '#f3f4f6'
    },
    cardContent: {
        padding: 15,
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#e6f7ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    badgeText: {
        color: '#007bff',
        fontSize: 12,
        fontWeight: '600',
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    coursePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a9c5c',
        marginBottom: 15,
    },
    buyButton: {
        backgroundColor: '#f3f4f6',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    buyButtonText: {
        color: '#4b5563',
        fontWeight: '600',
    }
});
