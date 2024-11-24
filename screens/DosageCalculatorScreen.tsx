import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Modal,
    Text,
    ScrollView,
    Keyboard,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { calculateDosage } from '../api/config';
import * as Clipboard from 'expo-clipboard';

const DosageCalculatorScreen = () => {
    const [medication, setMedication] = useState('');
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg'); // Toggle between kg and lbs
    const [age, setAge] = useState('');
    const [condition, setCondition] = useState('');
    const [dosageFormula, setDosageFormula] = useState('');
    const [frequency, setFrequency] = useState('');
    const [loading, setLoading] = useState(false);
    const [dosage, setDosage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCalculateDosage = async () => {
        if (!medication.trim() || !weight.trim()) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        Keyboard.dismiss(); // Dismiss keyboard to ensure a clean view
        setLoading(true);
        setDosage(null);

        try {
            const weightInKg = weightUnit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight);

            const result = await calculateDosage(
                medication,
                { weight: weightInKg, age: parseInt(age), condition },
                { formula: dosageFormula, frequency: parseInt(frequency) }
            );
            setDosage(result);
            setModalVisible(true);
        } catch (error) {
            console.error(error);
            setDosage('Error calculating dosage.');
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyResult = () => {
        if (dosage) {
            Clipboard.setString(dosage);
            Alert.alert('Copied!', 'Dosage result copied to clipboard.');
        }
    };

    return (
        <View style={styles.container}>
                {/* Medication Input */}
                <View style={styles.inputContainer}>
                    <Icon name="pill" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Medication"
                        placeholderTextColor="#888"
                        value={medication}
                        onChangeText={setMedication}
                    />
                </View>

                {/* Weight Input */}
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
                        onPress={() => setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg')}
                    >
                        <Text style={styles.toggleText}>
                            {weightUnit === 'kg' ? 'Switch to lbs' : 'Switch to kg'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Age Input */}
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

                {/* Condition Input */}
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

                {/* Dosage Formula Input */}
                <View style={styles.inputContainer}>
                    <Icon name="calculator-variant" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Dosage Formula (e.g., 10 mg/kg/dose)"
                        placeholderTextColor="#888"
                        value={dosageFormula}
                        onChangeText={setDosageFormula}
                    />
                </View>

                {/* Frequency Input */}
                <View style={styles.inputContainer}>
                    <Icon name="calendar-clock" size={24} color="#fff" />
                    <TextInput
                        style={styles.input}
                        placeholder="Frequency (e.g., 3 times/day)"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={frequency}
                        onChangeText={setFrequency}
                    />
                </View>

                {/* Calculate Button */}
                <TouchableOpacity style={styles.button} onPress={handleCalculateDosage}>
                    <Text style={styles.buttonText}>Calculate</Text>
                </TouchableOpacity>


            {/* Loading Indicator */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#1e88e5" />
                </View>
            )}

            {/* Modal for Results */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text selectable style={styles.modalText}>
                                {dosage}
                            </Text>
                        </ScrollView>
                        <TouchableOpacity style={styles.copyButton} onPress={handleCopyResult}>
                            <Text style={styles.copyButtonText}>Copy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
        justifyContent: 'center',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
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
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 20,
        width: '80%',
    },
    modalText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 20,
    },
    copyButton: {
        backgroundColor: '#1e88e5',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    copyButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#1e88e5',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default DosageCalculatorScreen;
