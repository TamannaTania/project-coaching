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
        // Assuming videos are in a /videos/ folder, or just in root
        finalUrl = API_HOST + prefix + encodeURI(finalUrl);
    }

    // Convert standard YouTube URLs to embed URLs if needed
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
                                {embedUrl}
                            </Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="play-circle" size={60} color="#1a9c5c" />
                        <Text style={styles.placeholderText}>Video playback is supported on Web in this demo.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
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
    videoContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 800,
        alignSelf: 'center',
        backgroundColor: '#000',
        aspectRatio: 16/9,
        marginTop: 20,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: 'white',
        marginTop: 10,
    }
});



