import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE, API_HOST } from './config';
import { Ionicons } from '@expo/vector-icons';

const API_URL = API_BASE + '/Courses';

export default function HomeScreen({ navigation }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(API_URL, {
                headers: { 'Authorization': "Bearer $token" }
            });
            if (response.ok) {
                const data = await response.json();
                const mapped = data.map(item => {
                    let img = item.imageUrl || 'https://via.placeholder.com/400x200?text=Physics+Course';
                    if (!img.startsWith('http')) {
                        const prefix = img.startsWith('/') ? '' : '/';
                        img = API_HOST + prefix + img;
                    }
                    return { ...item, imageUrl: img };
                });
                setCourses(mapped);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderCourseItem = (item) => (
        <TouchableOpacity 
            key={item.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                
                <View style={styles.footer}>
                    <Text style={styles.coursePrice}>? {item.price}</Text>
                    <View style={styles.buyButton}>
                        <Text style={styles.buyButtonText}>View Details</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#143d8d" />
                </View>
            ) : (
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.heroOverlay}>
                            <Text style={styles.heroHeadline}>Master Physics.{"\n"}Build Strong Concepts.{"\n"}Achieve Better Results.</Text>
                            <Text style={styles.heroSubtext}>Concept-based Physics learning with expert guidance, regular practice, and exam-focused preparation.</Text>
                            
                            <View style={styles.heroButtons}>
                                <TouchableOpacity style={styles.primaryBtn} onPress={() => {}}>
                                    <Ionicons name="school" size={20} color="white" style={{marginRight: 8}}/>
                                    <Text style={styles.primaryBtnText}>Explore Courses</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.secondaryBtn} onPress={() => {}}>
                                    <Ionicons name="call" size={20} color="#143d8d" style={{marginRight: 8}}/>
                                    <Text style={styles.secondaryBtnText}>Enroll Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Why Choose Us */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
                        <View style={styles.featuresGrid}>
                            <View style={styles.featureItem}>
                                <Ionicons name="bulb-outline" size={40} color="#1a9c5c" />
                                <Text style={styles.featureTitle}>Concept Building</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="chatbubbles-outline" size={40} color="#1a9c5c" />
                                <Text style={styles.featureTitle}>Easy Explanation</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="calculator-outline" size={40} color="#1a9c5c" />
                                <Text style={styles.featureTitle}>Numerical Practice</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-done-circle-outline" size={40} color="#1a9c5c" />
                                <Text style={styles.featureTitle}>Regular Assessment</Text>
                            </View>
                        </View>
                    </View>

                    {/* Featured Courses */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Featured Courses</Text>
                        <View style={styles.coursesList}>
                            {courses.map(course => renderCourseItem(course))}
                        </View>
                    </View>

                    {/* Call to Action */}
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>Ready to Make Physics Easier?</Text>
                        <TouchableOpacity style={styles.ctaButton} onPress={() => {}}>
                            <Text style={styles.ctaButtonText}>Join Our Course Today</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heroSection: {
        backgroundColor: '#143d8d',
        paddingVertical: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    heroOverlay: {
        maxWidth: 800,
        width: '100%',
        alignItems: 'center',
    },
    heroHeadline: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 40,
    },
    heroSubtext: {
        fontSize: 16,
        color: '#e2e8f0',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    heroButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    primaryBtn: {
        backgroundColor: '#1a9c5c',
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    secondaryBtn: {
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: '#143d8d',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
        maxWidth: 800,
    },
    featureItem: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    featureTitle: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#374151',
        textAlign: 'center',
    },
    coursesList: {
        width: '100%',
        maxWidth: 800,
    },
    card: {
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
        height: 200,
        backgroundColor: '#f3f4f6',
    },
    cardContent: {
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 15,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 15,
    },
    coursePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a9c5c',
    },
    buyButton: {
        backgroundColor: '#143d8d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    ctaSection: {
        backgroundColor: '#1a9c5c',
        padding: 40,
        alignItems: 'center',
        marginTop: 20,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    ctaButton: {
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    ctaButtonText: {
        color: '#1a9c5c',
        fontWeight: 'bold',
        fontSize: 18,
    }
});
