import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DosageCalculatorScreen from './screens/DosageCalculatorScreen';
import ClinicalReferenceScreen from './screens/ClinicalReferenceScreen';
import TranscriptionScreen from 'screens/TranscriptionScreen';
import TranscriptionDetailsScreen from 'screens/TranscriptionDetailsScreen';
import { useFonts, Dosis_400Regular } from '@expo-google-fonts/dosis';
import AppLoading from 'expo-app-loading';

const Stack = createStackNavigator();

export default function App() {
    let [fontsLoaded] = useFonts({ Dosis_400Regular });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: 'transparent', // Transparent background
                        elevation: 0, // Remove shadow on Android
                        shadowOpacity: 0, // Remove shadow on iOS
                    },
                    headerTitleStyle: {
                        fontFamily: 'Dosis_400Regular', // Use the Dosis font
                        fontSize: 24, // Adjust font size
                        color: '#1e88e5', // Header font color
                    },
                    headerTintColor: '#1e88e5', // Back button color
                    headerTransparent: true, // Ensure transparency
                    headerTitleAlign: 'center', // Center align the title
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: '' }} />
                <Stack.Screen
                    name="ClinicalReference"
                    component={ClinicalReferenceScreen}
                    options={{ title: 'Clinical Reference' }}
                />
                <Stack.Screen
                    name="DosageCalculator"
                    component={DosageCalculatorScreen}
                    options={{ title: 'Dosage Calculator' }}
                />
                <Stack.Screen
                    name="Transcription"
                    component={TranscriptionScreen}
                    options={{ title: 'Transcription' }}
                />
                <Stack.Screen
                    name="TranscriptionDetails"
                    component={TranscriptionDetailsScreen}
                    options={{ title: 'Transcription Details' }}
                />

                
            </Stack.Navigator>
        </NavigationContainer>
    );
}
