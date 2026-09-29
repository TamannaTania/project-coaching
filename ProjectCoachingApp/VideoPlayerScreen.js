import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_HOST } from './config';

export default function VideoPlayerScreen({ route, navigation }) {
    const { videoUrl, title } = route.params;

    let finalUrl = videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    
    // Fix relative URL for local uploads
    if (!finalUrl.startsWith('http')) {
        const prefix = finalUrl.startsWith('/') ? '' : '/';
        finalUrl = API_HOST + prefix + encodeURI(finalUrl);
    }

    let isMp4 = finalUrl.toLowerCase().endsWith('.mp4');
    let embedUrl = finalUrl;
    
    if (finalUrl.includes('youtube.com/watch?v=')) {
        embedUrl = finalUrl.replace('watch?v=', 'embed/');
    } else if (finalUrl.includes('youtu.be/')) {
        embedUrl = finalUrl.replace('youtu.be/', 'youtube.com/embed/');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title || 'Course Video'}</Text>
            </View>

            <View style={styles.videoContainer}>
                {Platform.OS === 'web' ? (
                    <>
                        {isMp4 ? (
                            <video 
                                src={embedUrl}
                                controls
                                autoPlay
                                style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
                            />
                        ) : (
                            <iframe 
                                src={embedUrl} 
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                        <View style={{ padding: 10, backgroundColor: '#1f2937', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>If the video does not play, you can open it directly:</Text>
                            <Text 
                                style={{ color: '#60a5fa', textDecorationLine: 'underline', marginTop: 5, textAlign: 'center' }}
                                onPress={() => window.open(embedUrl, '_blank')}
                            >
                                Click here to open video
                            </Text>
                        </View>
                    </>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                        <Ionicons name={isMp4 ? "play-circle" : "logo-youtube"} size={80} color={isMp4 ? "#1a9c5c" : "#ff0000"} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>Course Video</Text>
                        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginHorizontal: 20, marginTop: 5 }}>
                            To watch this video on mobile, please open it using your phone's native player.
                        </Text>
                        <TouchableOpacity 
                            style={{ marginTop: 20, backgroundColor: '#1f2937', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                            onPress={() => Linking.openURL(finalUrl)}
                        >
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Play Video Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
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
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    videoContainer: {
        flex: 1,
        backgroundColor: '#000',
    }
});
