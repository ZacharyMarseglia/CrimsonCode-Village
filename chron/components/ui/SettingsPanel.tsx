import React, { useEffect, useState } from "react";
import { StyleSheet, Animated, View, useWindowDimensions } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import TitleBar from "./TitleBar";

export default function SettingsPanel({visible, title, content}: { visible: boolean, title: string, content: React.ReactNode }) {    
    const backgroundColor = useThemeColor({ colorName: 'background' });
    const windowDimensions = useWindowDimensions();
    const translateX = useState(new Animated.Value(windowDimensions.width))[0];

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: visible ? 0 : windowDimensions.width,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, windowDimensions.width]);
    
    return (
        <View style={{ ...styles.settingsPanelView, display: visible ? "flex" : "none" }}>
            <TitleBar>{title}</TitleBar>
            <Animated.ScrollView style={{ transform: [{ translateX }], backgroundColor }} contentContainerStyle={{ padding: 20 }}>
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
        zIndex: 1000,
    },
})