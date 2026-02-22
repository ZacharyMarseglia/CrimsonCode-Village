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
| **Language** | C++ | TBD |
| **Persistence** | TBD | TBD |
| **Transcription** | `whisper.cpp` (using models based off FUTO Voice Input implementation) | TBD |
| **Storage** | `react-native-fs` | Storage Access Framework for cross-app directory access. |
| **Alarms** | `react-native-alarms` | High-precision scheduling that survives sleep states. |

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
