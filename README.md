
# Wellness Walrus App

---

### Overview

The **Wellness Walrus App** is a mobile application designed to assist healthcare professionals, particularly doctors and nurses, in managing patient care efficiently. It integrates modern AI tools, such as OpenAI models, to provide smart clinical references, patient assessments, and transcriptions, while maintaining a user-friendly and professional interface.

This app supports:
- Querying clinical references.
- Recording, transcribing, and formatting notes.
- Conducting dosage calculations.
- Incrementally gathering patient data through guided forms.

---

### Key Features

#### **1. Smart Clinical Reference**
- **Purpose**: Allows healthcare professionals to search for clinical information, including:
  - Conditions
  - Symptoms
  - Patient histories
  - Examination findings
- **Inputs**:
  - **Age** and **Weight** (with unit toggle between kg/lb).
  - Optional inputs revealed incrementally for:
    - Patient history
    - Symptoms
    - Exam findings
- **AI Integration**: Queries are processed by OpenAI's GPT model, providing structured and insightful responses.

---

#### **2. Dosage Calculator**
- **Purpose**: Accurate medication dosing based on patient-specific parameters.
- **Inputs**:
  - **Medication Name**
  - **Weight** (with kg/lb toggle)
  - **Dosage Formula** (e.g., `10 mg/kg/dose`)
  - **Frequency** (e.g., `3 times/day`)
- **AI Integration**: Uses GPT models to provide additional dosing insights or warnings, such as for pediatric or geriatric cases.
- **Results**:
  - Displays dosage in a modal pop-up.
  - Includes a copy button for easy sharing.

---

#### **3. Transcription System**
- **Purpose**: Record and transcribe patient notes into structured, markdown-style documents.
- **Features**:
  - **Recording**:
    - Uses Expo AV to record audio.
    - Stores recordings locally for later access.
  - **Transcription**:
    - Powered by OpenAI Whisper API to generate transcriptions.
    - Formats transcriptions into markdown-style notes.
  - **Management**:
    - Persistent storage of recordings and transcriptions.
    - Notes are accessible in a separate details screen with copy functionality.
  - **Markdown Viewer**:
    - Reformatted notes are displayed using a markdown renderer with hospital-themed styling.

---

### App Screens

#### **1. Clinical Reference Screen**
- **Purpose**: Query and manage patient data.
- **Key Features**:
  - Simple input form with toggles for age and weight.
  - Incremental "More Options" button to reveal additional inputs.
  - AI-powered responses to assist in diagnoses and differential considerations.

---

#### **2. Dosage Calculator Screen**
- **Purpose**: Calculate and display medication dosage based on patient parameters.
- **Key Features**:
  - User-friendly input fields with a toggle for weight units (kg/lb).
  - Outputs dosage recommendations in a clear and actionable format.
  - Copyable and shareable results.

---

#### **3. Transcription Screen**
- **Purpose**: Record, transcribe, and format clinical notes.
- **Key Features**:
  - Audio recording and transcription.
  - Notes are saved persistently on the device.
  - Markdown formatting for better readability.
  - Allows for copying and sharing of formatted notes.

---

### Technologies Used

#### **1. Frontend**:
- **React Native** with Expo for cross-platform development.
- **React Native Vector Icons** for professional UI elements.
- **react-native-markdown-display** for rendering markdown content.

#### **2. AI Integration**:
- **OpenAI GPT** for smart clinical references and reformatting notes.
- **OpenAI Whisper API** for speech-to-text transcription.

#### **3. Local Storage**:
- **AsyncStorage** for persistent storage of recordings and notes.

#### **4. Other Libraries**:
- **Expo AV** for audio recording and playback.

---


### File Structure

```
.
├── api/
│   ├── config.js       # Handles AI integrations (OpenAI GPT and Whisper API).
├── components/
│   ├── ClinicalReferenceScreen.tsx
│   ├── DosageCalculatorScreen.tsx
│   ├── TranscriptionScreen.tsx
│   ├── TranscriptionDetailsScreen.tsx
├── assets/
│   ├── fonts/          # Custom fonts for consistent branding.
├── App.js              # Main entry point of the application.
├── package.json        # Project dependencies and scripts.
```

---

### Future Improvements

1. **User Authentication**:
   - Add login/logout functionality to support multiple users.
2. **Customizable Settings**:
   - Allow users to set default values (e.g., weight unit).
3. **Data Export**:
   - Enable exporting clinical references and notes as PDFs.
4. **Multi-Language Support**:
   - Incorporate translations for non-English speaking users.
5. **Offline Mode**:
   - Provide limited functionality without an active internet connection.

---

### License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---
# WellnessApp
