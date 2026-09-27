import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://localhost:44307/api/Enrollments/mycourses';

export default function MyCoursesScreen({ navigation }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                
                // Map to fix image URLs
                const mapped = data.map(item => {
                    let img = item.imageUrl || 'https://via.placeholder.com/400x200?text=Course';
                    if (!img.startsWith('http')) {
                        const prefix = img.startsWith('/') ? '' : '/';
                        img = 'https://localhost:44307' + prefix + img;
                    }
                    return { ...item, imageUrl: img };
                });
                setCourses(mapped);
            }
        } catch (error) {
            console.error('Error fetching my courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CourseDetails', { courseId: item.courseId })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Approved' ? '#d1fae5' : '#fef3c7' }]}>
                    <Text style={{ color: item.status === 'Approved' ? '#059669' : '#d97706', fontWeight: 'bold' }}>
                        {item.status}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Courses</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1a9c5c" style={{ marginTop: 50 }} />
            ) : courses.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>You haven't enrolled in any courses yet.</Text>
                </View>
            ) : (
                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                    <FlatList
                        data={courses}
                        keyExtractor={(item, index) => (item.courseId ? item.courseId.toString() : index.toString())}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 20, width: '100%' }}
                        style={{ width: '100%', maxWidth: 800 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
    },
    card: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        aspectRatio: 16/9,
        backgroundColor: '#f3f4f6',
    },
    cardContent: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 10,
    }
});
