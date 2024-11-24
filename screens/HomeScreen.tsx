import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useFonts, Dosis_300Light, Dosis_400Regular } from '@expo-google-fonts/dosis';
import AppLoading from 'expo-app-loading';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const backgroundImage = require('../assets/background.jpg');

const HomeScreen = ({ navigation } : any) => {
  let [fontsLoaded] = useFonts({ Dosis_300Light, Dosis_400Regular });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={{ marginRight: 16 }}
        >
          <Icon name="cog" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Wellness Walrus</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ClinicalReference')}
        >
          <Icon name="book-open" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Clinical Reference</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DosageCalculator')}
        >
          <Icon name="calculator" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Dosage Calculator</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Transcription')}
        >
          <Icon name="microphone" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Notes Transcription</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Dosis_Medium',
    color: '#81BCAF',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e88e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Dosis_300Light',
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

export default HomeScreen;
