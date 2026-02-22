import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ActionButton({ title, onPress, buttonStyle, colors }: { title: string; onPress: () => void; colors?: { background?: string; text?: string }; buttonStyle?: object }) {
    const backgroundColor = colors?.background || useThemeColor({ colorName: 'buttonBackground' });
    const color = colors?.text || useThemeColor({ colorName: 'buttonText' });
    const buttonBackgroundPressedColor = useThemeColor({ colorName: 'buttonBackgroundPressed' });

    return (
        <Pressable
            onPress={onPress}
            android_ripple={{ color: buttonBackgroundPressedColor }}>
            <View style={{ ...styles.actionButton, ...buttonStyle, backgroundColor, color }}>{title}</View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        padding: 10,
        textAlign: 'center',
        userSelect: 'none',
    }
})