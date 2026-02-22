import { Pressable, StyleSheet } from "react-native";

export default function ActionButton({ title, onPress }: { title: string; onPress: () => void }) {
    return (
        <Pressable onPress={onPress}>
            <div style={styles.actionButton}>{title}</div>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    actionButton: {
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center'
    }
})