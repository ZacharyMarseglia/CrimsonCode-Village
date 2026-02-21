# Specification for Android App: "Chron"

## 1. Core Functionality & Logic

Chron is an Android application designed for periodic psychological/activity logging. It mimics the urgency of a phone call to ensure user engagement.

### **The "Trigger" Logic**
The app uses a background alarm system to trigger periodic checks (default: every 60 minutes). Before initiating a notification, it verifies:
1. **Event Status:** If the current time falls within an enabled **Event**, a log is automatically created with the event name and transcribed text. This **bypasses** battery and DND checks, and no notification is shown.
2. **Battery Level:** Skips the check-in if battery is <= 5% (only if no event is active).
3. **Do Not Disturb (DND):** Skips if the device is in any DND mode (only if no event is active).
4. **Internal Status:** Logs are only generated if the user has completed the initial vault setup.

### **The "Call" Interaction**
* **Urgent Notification:** Triggers a high-priority "Call" category notification with **Accept** (Green) and **Decline** (Red) buttons (using Android CallStyle).
* **Full-Screen Intent:** If the phone is locked, the app launches a full-screen activity that mimics an incoming call interface.
* **Audio/Visual Alerts:** The device vibrates and plays a call sound (ringtone) to grab the user's attention. Vibration pattern and ringtone are customizable.
* **Volume Key Support:** Pressing any hardware volume button while a "call" is incoming immediately declines the check-in and silences the alerts.
* **Seamless Recording:** Answering via the notification or the full-screen UI immediately begins compressed audio capture (**AAC** at 16kHz mono in an `.m4a` container).
* **Offline Transcription:** Audio is decoded and transcribed locally using **whisper.cpp** (JNI) to preserve privacy.

---

## 2. Technical Architecture

| Component | Technology | Implementation Details |
| --- | --- | --- |
| **Language** | TBD | TBD |
| **Persistence** | TBD | TBD |
| **Transcription** | `whisper.cpp` or `whisper-rn` (using models based off FUTO Voice Input implementation) | TBD |
| **Storage** | `SAF` or `react-native-saf-x` | Storage Access Framework for cross-app directory access. |
| **Alarms** | `RTC_WAKEUP` or `react-native-alarms` | High-precision scheduling that survives sleep states. |

---

## 3. Data Flow & Obsidian Integration

### **Storage Logic**
1. **Path Selection:** User selects an Obsidian Vault path (or other path if not using Obsidian) and an optional separate Voice Memos path via a native folder picker.
2. **Recording:** Captures are initially stored in the app's internal cache as compressed `.m4a` files to save space.
3. **Migration:** Upon successful transcription, the `.m4a` file is moved to the target directory.
4. **SAF Persistence:** The app takes persistable URI permissions to ensure background sync works without re-opening the app.

### **Daily Note Integration**
Chron automatically handles daily note updates:
* **File Target:** `YYYY-MM-DD.md` in the root of the selected vault.
* **Custom Heading:** Users can specify the Markdown heading (e.g., `## Activity Log`) used to group check-ins. If the heading is missing from an existing daily note, it is automatically appended.
* **Table Format:** Appends a new row to a Markdown table under the specified heading:
  `| Time | Activity | Voice Memo |`
* **Robust Table Insertion:** The app intelligently locates the log section and its associated table. It handles:
    * **Dynamic Header Detection:** Recognizes the log table even if columns are aligned with varying amounts of whitespace or if the casing differs (e.g., handles both `|Time|` and `| Time  |`).
    * **Missing Components:** Automatically creates the section heading and/or the table structure if either is missing.
    * **Table Fragmentation:** Bridges blank lines within a table section to find the true end of the log list, ensuring entries are appended to the existing group rather than starting a new table.
    * **Safe Appending:** Ensures new entries are added at the end of the table while respecting subsequent Markdown sections.

---

## 4. User Interface (The Dashboard)

The main app screen focuses on status and configuration while remaining clean:
* **Global Activation Toggle:** A prominent "Chron is ENABLED/DISABLED" switch at the top of the dashboard. Disabling Chron cancels all pending check-in alarms and clears active notifications.
* **Instant Log Button:** A "Record Log Now" button that immediately launches the call interface and begins recording, allowing for manual check-ins outside of the scheduled interval.
* **Categorized Settings:**
    * **General:**
        * "Check-in Interval" (minutes).
        * "Daily Start Time" (HH:mm).
        * "Daily End Time" (HH:mm).
        * "Vibrate on Call" toggle.
        * "Play Sound on Call" toggle.
        * "Update Call Sound" (System sound picker).
        * "Volume Stream" selector (Ring, Alarm, System).
        * "Call End Screen Lock" accessibility shortcut.
    * **Obsidian Integration:**
        * "Select Obsidian Vault" & "Select Memos Folder" buttons.
        * "Store voice memos in a separate folder" toggle.
        * "Log Section Heading" text box for Markdown customization (e.g., `## Activity Log`).
        * "Obsidian Vault Name" field (required for deep-linking).
    * **Event Configuration:**
        * "Add Event" button.
        * List of events with:
            * Event Name.
            * Recurrence (Specific days of the week).
            * Start and End Times (Time picker selection).
            * Enable/Disable checkbox.
            * **Event Override:** If the current time is within a scheduled and enabled event, a log entry is created immediately using the event name, and the standard "Call" notification is suppressed.
    * **Activity Feed (Last 24 Hours):**
    * A list of all recent check-ins.
5. Optional Prompting Layer (Text + Voice)

Chron supports an optional pre-recording prompt that nudges the user on what to reflect on before speaking. This prompt can be delivered as text, spoken audio, or both.

This layer is entirely optional, configurable globally and per-event, and does not block recording.

5.1 Prompt Types
Text Prompt

A short reflection question or instruction displayed:

On the incoming call UI

On the full-screen call activity

Examples:

“What are you doing right now?”

“What just happened?”

Voice Prompt

A short spoken message played immediately after answering the call and before recording begins

Generated using ElevenLabs Text-to-Speech

Automatically fades out and transitions into recording

Both prompts can be enabled independently.

5.2 Voice Prompt (ElevenLabs) Integration
Speech Generation

Provider: ElevenLabs Text-to-Speech API

Input: Prompt text (user-defined)

Output: .mp3 or .wav (cached)

Playback: Played once per call before recording starts

Caching & Offline Safety

Generated voice prompts are:

Cached locally after first generation

Reused until prompt text changes

If offline:

Cached audio is used

If no cache exists, Chron silently falls back to text-only

Privacy Model

Only the prompt text is sent to ElevenLabs

User recordings and transcripts are never sent off-device

ElevenLabs is used only for TTS, not transcription

5.3 Recording Flow with Prompt Enabled
Answering the Call

User taps Accept

(Optional) Voice prompt plays

Recording begins immediately after playback ends (or after a fixed delay)

Audio capture proceeds as normal (AAC 16kHz mono)

The user may start speaking during the prompt — recording starts automatically and captures everything after prompt playback ends.

5.4 Event-Level Prompt Overrides

Each Event may optionally define:

Custom Prompt Text

Enable/Disable Voice Prompt

Enable/Disable Text Prompt

Event Override Behavior

If an Event is active:

The Event’s prompt overrides the global prompt

The Event name is used as the Activity label

The call notification is still suppressed (as per existing Event Override logic)

5.5 Dashboard UI Additions
General → Prompting

Enable Prompting (Master toggle)

Default Prompt Text (multi-line)

Prompt Delivery Mode

Text Only

Voice Only

Text + Voice

Voice Provider

ElevenLabs

Voice Selection (dropdown)

Voice Speed / Tone (simple slider)

Test Prompt Playback button

Event Configuration → Prompt

Each Event includes:

Override Prompt Text toggle

Event Prompt Text

Use Voice Prompt toggle

Use Text Prompt toggle

5.6 Obsidian Logging (Prompt Awareness)

Prompt metadata is optionally embedded in the daily note:

Table Extension (Optional)

If enabled, the table becomes:

| Time | Activity | Prompt | Voice Memo |

Prompt column stores:

The prompt text used

Or the Event name if auto-generated

This column is optional and backward-compatible:

Existing tables without Prompt are respected

Chron dynamically adapts insertion logic based on detected headers

5.7 Failure & Fallback Behavior
Condition	Behavior
ElevenLabs unavailable	Text prompt only
No network + no cache	Silent skip
Prompt disabled	Normal call behavior
Prompt playback interrupted	Recording continues

Prompting never blocks logging.

5.8 Design Philosophy Alignment

This extension preserves Chron’s core principles:

Urgency remains intact

Privacy is not compromised

Events remain frictionless

Reflection is guided, not forced

The prompt is a gentle cognitive anchor, not a script.
    * **Interactivity:** Clicking an item opens the corresponding daily note in Obsidian.
    * Displays: Time (HH:mm), Status (Answered/Declined/Missed), and the Transcript.
    * **Visual Cues:** A check appears next to entries with saved audio files.
    * **Technical Privacy:** Technical SAF URI paths are hidden from the UI, replaced by user-friendly status toasts.
