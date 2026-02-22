import { View, StyleSheet, Text } from "react-native";

import ActionButton from "@/components/ui/ActionButton";
import TitleBar from "@/components/ui/TitleBar";
import { useThemeColor } from "@/hooks/useThemeColor";
import SettingsPanel from "@/components/ui/SettingsPanel";
import { useState } from "react";
import EventSettings from "./EventSettings";

export default function HomePage() {
    const backgroundColor = useThemeColor({ colorName: 'background' });
    const buttonBackgroundColorSpecial = useThemeColor({ colorName: 'buttonBackgroundSpecial' });
    const textColor = useThemeColor({ colorName: 'text' });

    const [eventsOpened, setEventsOpened] = useState(false);
    const [generalSettingsOpened, setGeneralSettingsOpened] = useState(false);
    const [markdownSettingsOpened, setMarkdownSettingsOpened] = useState(false);
    const [transcriptionSettingsOpened, setTranscriptionSettingsOpened] = useState(false);

    return (
        <View style={{ ...styles.homePageView, backgroundColor }}>
            <TitleBar>Chron</TitleBar>
            <View style={styles.homePageContent}>
                <View>
                    <ActionButton title="RECORD LOG NOW" buttonStyle={ styles.homePageButtonSpacing } colors={{ background: buttonBackgroundColorSpecial }} onPress={() => setEventsOpened(true)} />
                    <ActionButton title="EVENTS" buttonStyle={ styles.homePageButtonSpacing } onPress={() => setEventsOpened(true)} />
                    <ActionButton title="GENERAL SETTINGS" buttonStyle={ styles.homePageButtonSpacing } onPress={() => setGeneralSettingsOpened(true)} />
                    <ActionButton title="MARKDOWN SETTINGS" buttonStyle={ styles.homePageButtonSpacing } onPress={() => setMarkdownSettingsOpened(true)} />
                    <ActionButton title="TRANSCRIPTION SETTINGS" buttonStyle={ styles.homePageButtonSpacing } onPress={() => setTranscriptionSettingsOpened(true)} />
                </View>
                <View>
                    <Text style={{ ...styles.recentActivityText, color: textColor }}>Recent Activity</Text>
                </View>
            </View>
            <SettingsPanel visible={eventsOpened} title="Events" content={<EventSettings />} />
            <SettingsPanel visible={generalSettingsOpened} title="General Settings" content={
                <Text style={{ color: textColor }}>Settings content goes here</Text>
            } />
            <SettingsPanel visible={markdownSettingsOpened} title="Markdown Settings" content={
                <Text style={{ color: textColor }}>Markdown settings content goes here</Text>
            } />
            <SettingsPanel visible={transcriptionSettingsOpened} title="Transcription Settings" content={
                <Text style={{ color: textColor }}>Transcription settings content goes here</Text>
            } />
        </View>
    );
}

const styles = StyleSheet.create({
    homePageView: {
        flex: 1,
    },
    homePageContent: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    homePageButtonSpacing: {
        marginTop: 10,
    },
    recentActivityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    }
})