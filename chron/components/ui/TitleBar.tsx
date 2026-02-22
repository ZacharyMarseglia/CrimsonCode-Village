import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet } from 'react-native';

export default function TitleBar({ children }: { children: React.ReactNode }) {
    const backgroundColor = useThemeColor({ colorName: 'title' });
    const color = useThemeColor({ colorName: 'text' });
    
    return (
        <div style={{ ...styles.titleBar, backgroundColor, color }}>
            {children}
        </div>
    );
}

const styles = StyleSheet.create({
    titleBar: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    }
});