import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://localhost:44307/api';

export default function CourseDetailsScreen({ route, navigation }) {
    const { courseId } = route.params;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null, 'Pending', 'Approved'
    const [enrolling, setEnrolling] = useState(false);

    const [showPayment, setShowPayment] = useState(false);
    const [phone, setPhone] = useState('');
    const [trxId, setTrxId] = useState('');

    useEffect(() => {
        fetchCourseDetails();
        checkEnrollment();
    }, []);

    const fetchCourseDetails = async () => {
        try {
            const response = await fetch(`${API_BASE}/Courses/${courseId}`);
            if (response.ok) {
                const data = await response.json();
                let img = data.imageUrl || 'https://via.placeholder.com/600x400?text=Course';
                if (!img.startsWith('http')) {
                    const prefix = img.startsWith('/') ? '' : '/';
                    img = 'https://localhost:44307' + prefix + img;
                }
                data.imageUrl = img;
                setCourse(data);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollment = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE}/Enrollments/check/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if(data.status !== "None") {
                    setEnrollmentStatus(data.status);
                }
            }
        } catch (error) { }
    };

    const submitPayment = async () => {
        if (!phone || !trxId) {
            alert('Please enter Phone Number and TrxID');
            return;
        }
        setEnrolling(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE}/Enrollments/${courseId}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ phone, trxId })
            });
            if (response.ok) {
                setEnrollmentStatus('Pending');
                setShowPayment(false);
                if (Platform.OS === 'web') alert("Payment submitted! Wait for admin approval.");
                else Alert.alert("Success", "Payment submitted! Wait for admin approval.");
            } else {
                const err = await response.text();
                if (Platform.OS === 'web') alert(err);
                else Alert.alert("Error", err);
            }
        } catch (error) {
            console.error("Enrollment error", error);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#1a9c5c" /></View>;
    if (!course) return <View style={styles.center}><Text>Course not found</Text></View>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#1f2937" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Course Details</Text>
                </View>

                <Image source={{ uri: course.imageUrl }} style={styles.image} />
                
                <View style={styles.content}>
                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{course.badge || 'New'}</Text>
                    </View>
                    
                    <Text style={styles.title}>{course.title}</Text>
                    
                    <View style={styles.statsRow}>
                        <Ionicons name="people" size={20} color="#6b7280" />
                        <Text style={styles.statsText}>{course.enrolledCount} Students Enrolled</Text>
                    </View>

                    <Text style={styles.price}>৳ {course.price}</Text>

                    <Text style={styles.sectionTitle}>About this course</Text>
                    <Text style={styles.description}>{course.description}</Text>

                    {enrollmentStatus === 'Approved' ? (
                        <TouchableOpacity 
                            style={[styles.enrollBtn, { backgroundColor: '#e2136e' }]}
                            onPress={() => navigation.navigate('VideoPlayer', { videoUrl: course.videoUrl, title: course.title })}
                        >
                            <Ionicons name="play-circle" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.enrollBtnText}>Watch Video</Text>
                        </TouchableOpacity>
                    ) : enrollmentStatus === 'Pending' ? (
                        <View style={[styles.enrollBtn, { backgroundColor: '#fef3c7' }]}>
                            <Text style={[styles.enrollBtnText, { color: '#d97706' }]}>Enrollment Pending Approval...</Text>
                        </View>
                    ) : showPayment ? (
                        <View style={styles.paymentBox}>
                            <Text style={styles.paymentTitle}>Complete Payment</Text>
                            <Text style={styles.paymentDesc}>Send ৳{course.price} to our bKash/Nagad Merchant Number: 01636464862 and enter your details below:</Text>
                            
                            <Text style={styles.inputLabel}>Sender Phone Number</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="e.g. 017XXXXXXXX"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                            
                            <Text style={styles.inputLabel}>Transaction ID (TrxID)</Text>
                            <TextInput 
                                style={styles.input} 
                                placeholder="e.g. 9FX2B..."
                                value={trxId}
                                onChangeText={setTrxId}
                            />

                            <TouchableOpacity 
                                style={styles.enrollBtn} 
                                onPress={submitPayment}
                                disabled={enrolling}
                            >
                                {enrolling ? <ActivityIndicator color="white" /> : <Text style={styles.enrollBtnText}>Submit Payment</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowPayment(false)} style={{marginTop:15, alignItems:'center'}}>
                                <Text style={{color:'#6b7280'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.enrollBtn} onPress={() => setShowPayment(true)}>
                            <Text style={styles.enrollBtnText}>Enroll Now</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    mainContent: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        backgroundColor: '#fff',
        minHeight: '100%',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backBtn: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    image: {
        width: '100%',
        aspectRatio: 16/9,
        backgroundColor: '#f3f4f6',
    },
    content: {
        padding: 20,
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#e6f7ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 10,
    },
    badgeText: {
        color: '#007bff',
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 10,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    statsText: {
        marginLeft: 8,
        color: '#6b7280',
        fontSize: 14,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a9c5c',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 10,
        marginTop: 10,
    },
    description: {
        fontSize: 15,
        color: '#4b5563',
        lineHeight: 24,
        marginBottom: 30,
    },
    enrollBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#1a9c5c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    enrollBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    paymentBox: {
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 10,
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 5,
    },
    paymentDesc: {
        color: '#6b7280',
        marginBottom: 15,
    },
    inputLabel: {
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
    }
});
