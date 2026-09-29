import { Platform } from 'react-native';

// Use localhost for web, and PC's local IP for mobile (Expo Go)
// Important: Replace 192.168.1.102 with your actual IPv4 address if it changes!
const IP_ADDRESS = '192.168.1.102';

export const API_HOST = Platform.OS === 'web' 
    ? 'https://localhost:44307' 
    : `http://${IP_ADDRESS}:5169`;

export const API_BASE = `${API_HOST}/api`;
