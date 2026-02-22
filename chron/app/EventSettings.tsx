import { useThemeColor } from "@/hooks/useThemeColor";
import { ArrowLeft } from "lucide-react-native";
import { View, Text, Pressable } from "react-native"

export default function EventSettings({setVisible}: { setVisible: (visible: boolean) => void }) {
    return (
        <View>
            <Pressable onPress={() => setVisible(false)}>
                <ArrowLeft color={useThemeColor({ colorName: 'icon' })} />
            </Pressable>
            <Text style={{ color: useThemeColor({ colorName: 'text' }) }}>Event settings content goes here</Text>
        </View>
    );
}