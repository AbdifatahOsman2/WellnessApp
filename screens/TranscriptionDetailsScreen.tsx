import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reformatTranscription } from '../api/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Clipboard from 'expo-clipboard';

const TranscriptionDetailsScreen = ({ route, navigation }: any) => {
    const { item } = route.params;
    const [formattedNotes, setFormattedNotes] = useState<string | null>(item.formattedNotes || null);
    const [loading, setLoading] = useState(false);

    const STORAGE_KEY = `@formattedNotes_${item.title}`;

    // Load persisted reformatted notes
    useEffect(() => {
        const loadFormattedNotes = async () => {
            try {
                const savedNotes = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedNotes) {
                    setFormattedNotes(savedNotes);
                }
            } catch (error) {
                console.error('Error loading saved notes:', error);
            }
        };
        loadFormattedNotes();
    }, []);

    // Save formatted notes to AsyncStorage
    const saveFormattedNotes = async (notes: string) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, notes);
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const handleReformat = async () => {
        setLoading(true);
        try {
            const formatted = await reformatTranscription(item.transcription);
            setFormattedNotes(formatted);
            item.formattedNotes = formatted; // Update the item object
            saveFormattedNotes(formatted); // Persist the reformatted notes
        } catch (error) {
            Alert.alert('Error', 'Failed to reformat notes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        Clipboard.setString(formattedNotes || item.transcription);
        Alert.alert('Copied!', 'Notes copied to clipboard.');
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Icon
                    name="content-copy"
                    size={24}
                    color="#1e88e5"
                    style={{ marginRight: 16 }}
                    onPress={handleCopy}
                />
            ),
        });
    }, [navigation, formattedNotes]);

    return (
        <View style={styles.container}>
            {/* Display Original or Reformatted Notes */}
            <ScrollView style={styles.notesContainer}>
                {formattedNotes ? (
                    <Markdown style={markdownStyles as any}>{formattedNotes}</Markdown>
                ) : (
                    <Text style={styles.transcriptionText}>{item.transcription}</Text>
                )}
            </ScrollView>

            {/* Reformat Button */}
            {!formattedNotes && (
                <TouchableOpacity style={styles.reformatButton} onPress={handleReformat}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.reformatButtonText}>Reformat Notes</Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    notesContainer: {
        flex: 1,
        marginBottom: 16,
        marginTop: 126,
    },
    transcriptionText: {
        color: '#fff',
        fontSize: 16,
    },
    reformatButton: {
        backgroundColor: '#1e88e5',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    reformatButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

const markdownStyles = {
    heading1: { color: '#6495ED', fontSize: 24, fontFamily: 'Dosis_400Regular' },
    heading2: { color: '#6495ED', fontSize: 20, fontFamily: 'Dosis_400Regular' },
    heading3: { color: '#6495ED', fontSize: 18, fontFamily: 'Dosis_400Regular' },
    text: { color: '#fff', fontSize: 16, fontFamily: 'Dosis_300Light' },
    bullet_list: { color: '#fff', marginLeft: 16 },
    ordered_list: { color: '#fff', marginLeft: 16 },
    link: { color: '#6495ED', textDecorationLine: 'underline' },
};

export default TranscriptionDetailsScreen;
