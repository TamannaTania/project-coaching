import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator, 
    Alert, 
    Platform, 
    TextInput,
    Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE, API_HOST } from './config';

export default function CourseDetailsScreen({ route, navigation }) {
    const { courseId } = route.params;
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null); // null, 'Pending', 'Approved'
    const [enrolling, setEnrolling] = useState(false);

    const [showPayment, setShowPayment] = useState(false);
    const [phone, setPhone] = useState('');
    const [trxId, setTrxId] = useState('');

    // Chapters state
    const [expandedChapters, setExpandedChapters] = useState({});
    const [chapterSearch, setChapterSearch] = useState('');

    useEffect(() => {
        fetchCourseDetails();
        checkEnrollment();
    }, []);

    const fetchCourseDetails = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_BASE}/Courses/${courseId}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (response.ok) {
                const data = await response.json();
                let img = data.imageUrl || 'https://via.placeholder.com/600x400?text=Course';
                if (!img.startsWith('http')) {
                    const prefix = img.startsWith('/') ? '' : '/';
                    img = API_HOST + prefix + img;
                }
                data.imageUrl = img;
                setCourse(data);

                // Auto-expand first chapter by default
                if (data.chapters && data.chapters.length > 0) {
                    setExpandedChapters({ [data.chapters[0].id]: true });
                }
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

    const toggleChapter = (id) => {
        setExpandedChapters(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handlePlayVideo = (videoUrl, title) => {
        if (!videoUrl) {
            const msg = "এই ভিডিওটি দেখতে কোর্সে ভর্তি হতে হবে।";
            if (Platform.OS === 'web') alert(msg);
            else Alert.alert("লক করা আছে 🔒", msg);
            return;
        }
        navigation.navigate('VideoPlayer', { videoUrl, title });
    };

    const handleOpenPdf = (pdfUrl, title) => {
        if (!pdfUrl) {
            const msg = "স্টাডি ম্যাটেরিয়াল ও PDF পেতে কোর্সে ভর্তি হতে হবে।";
            if (Platform.OS === 'web') alert(msg);
            else Alert.alert("লক করা আছে 🔒", msg);
            return;
        }
        let fullUrl = pdfUrl;
        if (!fullUrl.startsWith('http')) {
            const prefix = fullUrl.startsWith('/') ? '' : '/';
            fullUrl = API_HOST + prefix + fullUrl;
        }
        Linking.openURL(fullUrl).catch(err => {
            if (Platform.OS === 'web') alert("PDF ওপেন করা যায়নি: " + err.message);
            else Alert.alert("Error", "PDF ওপেন করা যায়নি।");
        });
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#0284c7" /></View>;
    if (!course) return <View style={styles.center}><Text>Course not found</Text></View>;

    const isEnrolled = enrollmentStatus === 'Approved' || course.isEnrolled === true;

    // Filter chapters based on search query
    const chapters = (course.chapters || []).filter(ch => {
        if (!chapterSearch.trim()) return true;
        const q = chapterSearch.toLowerCase();
        const chMatch = ch.title.toLowerCase().includes(q);
        const topicMatch = (ch.contents || []).some(c => c.title.toLowerCase().includes(q));
        return chMatch || topicMatch;
    });

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.mainContent}>
                
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {course.title}
                    </Text>
                </View>

                {/* Course Banner */}
                <Image source={{ uri: course.imageUrl }} style={styles.image} />
                
                <View style={styles.content}>
                    
                    {/* Enrollment Status Banner */}
                    {isEnrolled ? (
                        <View style={styles.enrolledBanner}>
                            <Ionicons name="checkmark-circle" size={22} color="#059669" />
                            <Text style={styles.enrolledBannerText}>ভর্তি সম্পন্ন হয়েছে (Access Unlocked)</Text>
                        </View>
                    ) : enrollmentStatus === 'Pending' ? (
                        <View style={styles.pendingBanner}>
                            <Ionicons name="time" size={20} color="#d97706" />
                            <Text style={styles.pendingBannerText}>পেমেন্ট ভেরিফিকেশন পেন্ডিং আছে...</Text>
                        </View>
                    ) : null}

                    {/* Course Title & Price */}
                    <Text style={styles.title}>{course.title}</Text>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="people" size={18} color="#0284c7" />
                            <Text style={styles.statsText}>{course.enrolledCount || 0} জন শিক্ষার্থী</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="layers" size={18} color="#6366f1" />
                            <Text style={styles.statsText}>{(course.chapters || []).length} অধ্যায়</Text>
                        </View>
                    </View>

                    {!isEnrolled && (
                        <Text style={styles.price}>৳ {course.price}</Text>
                    )}

                    {/* Description */}
                    <Text style={styles.sectionTitle}>কোর্সের বিবরণ</Text>
                    <Text style={styles.description}>{course.description}</Text>

                    {/* ================= CHAPTERWISE CONTENTS (LIKE WEB) ================= */}
                    <View style={styles.contentsSection}>
                        <View style={styles.contentsHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Ionicons name="albums" size={20} color="#0284c7" />
                                <Text style={styles.contentsTitle}>অধ্যায় ও বিষয়সমূহ (Contents)</Text>
                            </View>
                        </View>

                        {/* Search Input for Chapters & Topics */}
                        {(course.chapters || []).length > 0 && (
                            <View style={styles.searchBox}>
                                <Ionicons name="search" size={16} color="#94a3b8" style={{ marginRight: 8 }} />
                                <TextInput 
                                    placeholder="অধ্যায় বা টপিক খুঁজুন..."
                                    placeholderTextColor="#94a3b8"
                                    value={chapterSearch}
                                    onChangeText={setChapterSearch}
                                    style={styles.searchInput}
                                />
                                {chapterSearch ? (
                                    <TouchableOpacity onPress={() => setChapterSearch('')}>
                                        <Ionicons name="close-circle" size={16} color="#94a3b8" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        )}

                        {/* Chapters Accordion List */}
                        {chapters.length === 0 ? (
                            <View style={styles.emptyChapters}>
                                <Text style={styles.emptyChaptersText}>কোনো অধ্যায় পাওয়া যায়নি।</Text>
                            </View>
                        ) : (
                            chapters.map((ch, idx) => {
                                const isExpanded = !!expandedChapters[ch.id];
                                const contents = ch.contents || [];
                                const videos = contents.filter(c => c.type === 'Video');
                                const pdfs = contents.filter(c => c.type !== 'Video');

                                return (
                                    <View key={ch.id} style={styles.chapterCard}>
                                        
                                        {/* Chapter Accordion Header */}
                                        <TouchableOpacity 
                                            style={styles.chapterHeader} 
                                            activeOpacity={0.8}
                                            onPress={() => toggleChapter(ch.id)}
                                        >
                                            <View style={styles.chapterHeaderLeft}>
                                                <View style={styles.chapterNumberBadge}>
                                                    <Text style={styles.chapterNumberText}>{idx + 1}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.chapterTitle} numberOfLines={2}>
                                                        {ch.title}
                                                    </Text>
                                                    <Text style={styles.chapterSubText}>
                                                        {videos.length} ভিডিও • {pdfs.length} PDF
                                                    </Text>
                                                </View>
                                            </View>
                                            <Ionicons 
                                                name={isExpanded ? "chevron-up" : "chevron-down"} 
                                                size={20} 
                                                color="#cbd5e1" 
                                            />
                                        </TouchableOpacity>

                                        {/* Chapter Contents Body */}
                                        {isExpanded && (
                                            <View style={styles.chapterBody}>
                                                
                                                {/* Videos Section */}
                                                <Text style={styles.topicSectionHeader}>
                                                    <Ionicons name="videocam" size={14} color="#0284c7" /> ভিডিও লেকচার ({videos.length})
                                                </Text>
                                                {videos.length === 0 ? (
                                                    <Text style={styles.noItemText}>কোনো ভিডিও নেই</Text>
                                                ) : (
                                                    videos.map(v => (
                                                        <TouchableOpacity 
                                                            key={v.id} 
                                                            style={styles.topicRow}
                                                            activeOpacity={0.7}
                                                            onPress={() => handlePlayVideo(v.url, v.title)}
                                                        >
                                                            <View style={[styles.topicIconBox, { backgroundColor: isEnrolled ? '#e0f2fe' : '#f1f5f9' }]}>
                                                                <Ionicons 
                                                                    name={isEnrolled ? "play" : "lock-closed"} 
                                                                    size={16} 
                                                                    color={isEnrolled ? "#0284c7" : "#94a3b8"} 
                                                                />
                                                            </View>
                                                            <Text style={styles.topicTitle} numberOfLines={2}>{v.title}</Text>
                                                            <View style={styles.actionChip}>
                                                                <Text style={styles.actionChipText}>
                                                                    {isEnrolled ? "প্লে" : "লক"}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ))
                                                )}

                                                {/* PDFs Section */}
                                                <Text style={[styles.topicSectionHeader, { marginTop: 14 }]}>
                                                    <Ionicons name="document-text" size={14} color="#ef4444" /> স্টাডি ম্যাটেরিয়াল ও PDF ({pdfs.length})
                                                </Text>
                                                {pdfs.length === 0 ? (
                                                    <Text style={styles.noItemText}>কোনো PDF লেকচার নেই</Text>
                                                ) : (
                                                    pdfs.map(p => (
                                                        <TouchableOpacity 
                                                            key={p.id} 
                                                            style={styles.topicRow}
                                                            activeOpacity={0.7}
                                                            onPress={() => handleOpenPdf(p.url, p.title)}
                                                        >
                                                            <View style={[styles.topicIconBox, { backgroundColor: isEnrolled ? '#fee2e2' : '#f1f5f9' }]}>
                                                                <Ionicons 
                                                                    name={isEnrolled ? "document-attach" : "lock-closed"} 
                                                                    size={16} 
                                                                    color={isEnrolled ? "#ef4444" : "#94a3b8"} 
                                                                />
                                                            </View>
                                                            <Text style={styles.topicTitle} numberOfLines={2}>{p.title}</Text>
                                                            <View style={[styles.actionChip, { backgroundColor: isEnrolled ? '#fef2f2' : '#f1f5f9' }]}>
                                                                <Text style={[styles.actionChipText, { color: isEnrolled ? '#ef4444' : '#64748b' }]}>
                                                                    {isEnrolled ? "PDF ভিউ" : "লক"}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ))
                                                )}

                                            </View>
                                        )}

                                    </View>
                                );
                            })
                        )}
                    </View>

                    {/* ================= ENROLLMENT / PAYMENT BUTTON ================= */}
                    {!isEnrolled && (
                        enrollmentStatus === 'Pending' ? (
                            <View style={[styles.enrollBtn, { backgroundColor: '#fef3c7', marginTop: 24 }]}>
                                <Text style={[styles.enrollBtnText, { color: '#d97706' }]}>অ্যাপ্রুভালের অপেক্ষায়...</Text>
                            </View>
                        ) : showPayment ? (
                            <View style={styles.paymentBox}>
                                <Text style={styles.paymentTitle}>পেমেন্ট সম্পন্ন করুন</Text>
                                <Text style={styles.paymentDesc}>
                                    বিকাশ/নগদ মার্চেন্ট নাম্বারে ৳{course.price} সেন্ড মানি করুন: <Text style={{fontWeight: 'bold', color: '#0f172a'}}>01636464862</Text> এবং নিচে ট্রানজেকশন তথ্য দিন:
                                </Text>
                                
                                <Text style={styles.inputLabel}>সেন্ডার মোবাইল নম্বর</Text>
                                <TextInput 
                                    style={styles.input} 
                                    placeholder="e.g. 017XXXXXXXX"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                                
                                <Text style={styles.inputLabel}>ট্রানজেকশন আইডি (TrxID)</Text>
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
                                    {enrolling ? <ActivityIndicator color="white" /> : <Text style={styles.enrollBtnText}>সাবমিট করুন</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowPayment(false)} style={{marginTop:15, alignItems:'center'}}>
                                    <Text style={{color:'#64748b', fontWeight:'bold'}}>বাতিল করুন</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.enrollBtn} onPress={() => setShowPayment(true)}>
                                <Ionicons name="card-outline" size={20} color="white" style={{ marginRight: 8 }} />
                                <Text style={styles.enrollBtnText}>এখনই ভর্তি হোন (৳{course.price})</Text>
                            </TouchableOpacity>
                        )
                    )}

                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    mainContent: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        backgroundColor: '#fff',
        minHeight: '100%',
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backBtn: {
        marginRight: 12,
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
        flex: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 16/9,
        backgroundColor: '#0f172a',
    },
    content: {
        padding: 16,
    },
    enrolledBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#a7f3d0',
        borderRadius: 12,
        padding: 12,
        gap: 8,
        marginBottom: 14,
    },
    enrolledBannerText: {
        color: '#065f46',
        fontWeight: 'bold',
        fontSize: 13,
    },
    pendingBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        borderRadius: 12,
        padding: 12,
        gap: 8,
        marginBottom: 14,
    },
    pendingBannerText: {
        color: '#92400e',
        fontWeight: 'bold',
        fontSize: 13,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: 28,
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statsText: {
        color: '#64748b',
        fontSize: 13,
        fontWeight: '600',
    },
    price: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0284c7',
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 6,
        marginTop: 6,
    },
    description: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 20,
        marginBottom: 20,
    },

    // Contents Section
    contentsSection: {
        marginTop: 8,
        marginBottom: 20,
    },
    contentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    contentsTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0f172a',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: '#0f172a',
    },
    emptyChapters: {
        padding: 20,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        alignItems: 'center',
    },
    emptyChaptersText: {
        color: '#94a3b8',
        fontSize: 13,
    },

    // Chapter Card
    chapterCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 10,
        overflow: 'hidden',
    },
    chapterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        backgroundColor: '#0f172a', // Deep Blue Shade
    },
    chapterHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 10,
        marginRight: 8,
    },
    chapterNumberBadge: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: '#0284c7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterNumberText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    chapterTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    chapterSubText: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 2,
    },
    chapterBody: {
        padding: 12,
        backgroundColor: '#f8fafc',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    topicSectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    noItemText: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
        paddingLeft: 4,
        marginBottom: 6,
    },
    topicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    topicIconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    topicTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
    },
    actionChip: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    actionChipText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0284c7',
    },

    // Enroll & Payment Buttons
    enrollBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#0284c7', // Sleek Blue
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#0284c7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 10,
    },
    enrollBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    paymentBox: {
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 16,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    paymentDesc: {
        color: '#64748b',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 14,
    },
    inputLabel: {
        fontWeight: 'bold',
        color: '#334155',
        fontSize: 12,
        marginBottom: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
        marginBottom: 12,
    }
});
