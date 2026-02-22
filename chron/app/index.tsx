import { View, StyleSheet } from "react-native";

import ActionButton from "@/components/ui/ActionButton";
import TitleBar from "@/components/ui/TitleBar";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomePage() {
    const backgroundColor = useThemeColor({ colorName: 'background' });
    const buttonBackgroundColor = useThemeColor({ colorName: 'buttonBackground' });

    return (
        <View style={{ ...styles.homePageView, backgroundColor }}>
            <TitleBar>Chron</TitleBar>
            <View style={{ ...styles.buttonContainer, backgroundColor: buttonBackgroundColor }}>
                <ActionButton title="Press me" onPress={() => alert('Pressed!')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    homePageView: {
        flex: 1,
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
    }
})