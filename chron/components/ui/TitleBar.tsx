import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, View, Text } from 'react-native';

export default function TitleBar({ children }: { children: React.ReactNode }) {
    const backgroundColor = useThemeColor({ colorName: 'title' });
    const color = useThemeColor({ colorName: 'text' });

    return (
        <View style={{ ...styles.titleContainer, backgroundColor }}>
            <Text style={{ ...styles.titleText, color }}>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        marginBottom: 20,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});