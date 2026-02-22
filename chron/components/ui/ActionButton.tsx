import { Pressable, StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ActionButton({ title, onPress, colors }: { title: string; onPress: () => void; colors?: { background?: string; text?: string } }) {
    const backgroundColor = colors?.background || useThemeColor({ colorName: 'buttonBackground' });
    const color = colors?.text || useThemeColor({ colorName: 'buttonText' });
    
    return (
        <Pressable onPress={onPress}>
            <View style={{ ...styles.actionButton, backgroundColor, color }}>{title}</View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        padding: 10,
        textAlign: 'center',
    }
})