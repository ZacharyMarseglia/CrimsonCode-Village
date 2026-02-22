import { use, useEffect, useState } from "react";
import { StyleSheet, Animated, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import TitleBar from "./TitleBar";

export default function SettingsPanel({visible, title, content}: { visible: boolean, title: string, content: React.ReactNode }) {    
    const backgroundColor = useThemeColor({ colorName: 'background' });
    const titleColor = useThemeColor({ colorName: 'title' });

    const translateX = useState(new Animated.Value(300))[0];

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : 300,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);
    
    return (
        <View style={{ ...styles.settingsPanelView, display: visible ? "flex" : "none" }}>
            <TitleBar>{title}</TitleBar>
            <Animated.ScrollView style={{ ...styles.settingsPanel, backgroundColor }} contentContainerStyle={{ padding: 20 }}>
                {content}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    settingsPanelView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    settingsPanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    }
})