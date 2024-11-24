import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Text,
    Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { generateClinicalResponse } from '../api/config';

const ClinicalReferenceScreen = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg'); // Weight unit toggle
    const [condition, setCondition] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [history, setHistory] = useState('');
    const [examFindings, setExamFindings] = useState('');

    const [revealedInputs, setRevealedInputs] = useState<number>(0);

    const handleSearch = async () => {
        // Dismiss keyboard
        Keyboard.dismiss();

        if (!query.trim()) {
            setError('Please enter a valid query.');
            return;
        }

        setLoading(true);
        setResponse(null);
        setError(null);

        try {
            const patientDetails = {
                age: age ? parseInt(age) : undefined,
                weight: weight
                    ? weightUnit === 'lb'
                        ? parseFloat(weight) * 0.453592 // Convert lb to kg
                        : parseFloat(weight)
                    : undefined,
                condition: condition || 'N/A',
                symptoms,
                history,
                examFindings,
            };

            const result = await generateClinicalResponse(query, patientDetails);
            setResponse(result);
        } catch (err) {
            console.error('Error fetching clinical response:', err);
            setError('Failed to fetch clinical response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const revealNextInput = () => {
        setRevealedInputs(revealedInputs + 1);
    };

    return (
        <View style={styles.container}>
            <View style={styles.insideContainer}>
                {/* Search Bar */}
                <View style={styles.inputContainer}>
                    <Icon name="magnify" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter clinical query..."
                        placeholderTextColor="#888"
                        value={query}
                        onChangeText={setQuery}
                    />
                </View>

                {/* Age Input */}


                {/* Weight Input with Unit Toggle */}


                {/* Additional Inputs */}
                {revealedInputs > 0 && (
                                    <View style={styles.inputContainer}>
                                    <Icon name="account" size={24} color="#fff" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Age (optional)"
                                        placeholderTextColor="#888"
                                        keyboardType="numeric"
                                        value={age}
                                        onChangeText={setAge}
                                        returnKeyType="done"
                                    />
                                </View>
                )}
                {revealedInputs > 1 && (
                                    <View style={styles.inputContainer}>
                                    <Icon name="weight-kilogram" size={24} color="#fff" />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={`Weight (${weightUnit})`}
                                        placeholderTextColor="#888"
                                        keyboardType="numeric"
                                        value={weight}
                                        onChangeText={setWeight}
                                        returnKeyType="done"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setWeightUnit(weightUnit === 'kg' ? 'lb' : 'kg')}
                                    >
                                        <Text style={styles.toggleText}>
                                            {weightUnit === 'kg' ? 'Switch to lb' : 'Switch to kg'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                )}
                {revealedInputs > 2 && (
                    <View style={styles.inputContainer}>
                        <Icon name="stethoscope" size={24} color="#fff" />
                        <TextInput
                            style={styles.input}
                            placeholder="Condition (optional)"
                            placeholderTextColor="#888"
                            value={condition}
                            onChangeText={setCondition}
                        />
                    </View>
                )}
                {revealedInputs > 3 && (
                    <View style={styles.inputContainer}>
                        <Icon name="format-list-bulleted" size={24} color="#fff" />
                        <TextInput
                            style={styles.input}
                            placeholder="Symptoms (optional)"
                            placeholderTextColor="#888"
                            value={symptoms}
                            onChangeText={setSymptoms}
                        />
                    </View>
                )}
                {revealedInputs > 4 && (
                    <View style={styles.inputContainer}>
                        <Icon name="notebook" size={24} color="#fff" />
                        <TextInput
                            style={styles.input}
                            placeholder="History (optional)"
                            placeholderTextColor="#888"
                            value={history}
                            onChangeText={setHistory}
                        />
                    </View>
                )}
                {revealedInputs > 5 && (
                    <View style={styles.inputContainer}>
                        <Icon name="clipboard-text" size={24} color="#fff" />
                        <TextInput
                            style={styles.input}
                            placeholder="Exam Findings (optional)"
                            placeholderTextColor="#888"
                            value={examFindings}
                            onChangeText={setExamFindings}
                        />
                    </View>
                )}

                {/* Reveal More Options */}
                {revealedInputs < 6 && (
                    <TouchableOpacity style={styles.moreOptionsButton} onPress={revealNextInput}>
                        <Icon name="plus" size={24} color="#fff" />
                        <Text style={styles.moreOptionsText}>More Options</Text>
                    </TouchableOpacity>
                )}

                {/* Search Button */}
                <TouchableOpacity style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>

                {/* Loading Indicator */}
                {loading && <ActivityIndicator size="large" color="#1e88e5" style={styles.loading} />}

                {/* Scrollable Response */}
                {response && (
                    <ScrollView style={styles.responseContainer}>
                        <Text style={styles.responseText}>{response}</Text>
                    </ScrollView>
                )}

                {/* Error Message */}
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    insideContainer: {
        marginTop: 126,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        marginLeft: 8,
    },
    toggleText: {
        color: '#1e88e5',
        fontSize: 14,
        marginLeft: 8,
    },
    button: {
        backgroundColor: '#1e88e5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    moreOptionsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    moreOptionsText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    loading: {
        marginTop: 16,
    },
    responseContainer: {
        marginTop: 16,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 16,
    },
    responseText: {
        color: '#fff',
        fontSize: 16,
    },
    errorText: {
        color: '#ff5252',
        marginTop: 16,
        textAlign: 'center',
    },
});

export default ClinicalReferenceScreen;
