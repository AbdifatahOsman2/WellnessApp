import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const TranscriptionScreen = ({ navigation }: any) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<
    {
      title: string;
      transcription: string;
      fileUri: string;
      createdAt: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.OPENAI_API_KEY;
  const STORAGE_KEY = "@recordings";

  // Load recordings from AsyncStorage
  useEffect(() => {
    const loadRecordings = async () => {
      const savedRecordings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedRecordings) {
        setRecordings(JSON.parse(savedRecordings));
      }
    };
    loadRecordings();
  }, []);

  // Save recordings to AsyncStorage
  const saveRecordings = async (updatedRecordings: any) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecordings));
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Denied",
          "Please grant microphone permissions."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      setLoading(true);

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert(
        "Recording Error",
        "Failed to start recording. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      setLoading(true);
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();
      if (uri) {
        transcribeAudio(uri);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    } finally {
      setRecording(null);
      setLoading(false);
    }
  };

  const transcribeAudio = async (audioUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: audioUri,
      name: "audio.m4a",
      type: "audio/m4a",
    } as any);
    formData.append("model", "whisper-1");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newRecording = {
        title: `Note ${recordings.length + 1}`,
        transcription: response.data.text,
        fileUri: audioUri,
        createdAt: new Date().toLocaleString(), // Add creation date
      };

      const updatedRecordings = [...recordings, newRecording];
      setRecordings(updatedRecordings);
      saveRecordings(updatedRecordings);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error transcribing audio:", error.message);
      } else {
        console.error("Error transcribing audio:", String(error));
      }
      Alert.alert("Error", "Failed to transcribe audio. Please try again.");
    }
  };

  const deleteRecording = (index: number) => {
    const updatedRecordings = recordings.filter((_, i) => i !== index);
    setRecordings(updatedRecordings);
    saveRecordings(updatedRecordings);
  };

  return (
    <View style={styles.container}>
      {/* Record/Stop Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecording : startRecording}
      >
        <Icon
          name={recording ? "stop-circle" : "microphone"}
          size={24}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>
          {recording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1e88e5" />
        </View>
      )}
      <Text style={styles.title}>Recorded Notes</Text>

      {/* Recordings List */}
      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.recordingItem}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate('TranscriptionDetails', { item: { ...item, title: `Note ${index + 1}` } })
            }
            >
              <Text style={styles.recordingTitle}>{item.title}</Text>
              <Text style={styles.recordingDate}>{item.createdAt}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteRecording(index)}>
              <Icon name="delete" size={24} color="#ff5252" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#1e88e5",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 126,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  recordingItem: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  recordingTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
  recordingDate: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: "Dosis_400Regular",
    color: "#fff",
    marginBottom: 22,
  },
});

export default TranscriptionScreen;
