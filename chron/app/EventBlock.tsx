import { useThemeColor } from "@/hooks/useThemeColor";
import { Event } from "@/services/events/events";
import { PencilIcon, TrashIcon } from "lucide-react-native";
import React, { StyleSheet, View, Text } from "react-native";

export default function EventBlock({ event }: { event: Event }) {
    const eventBlockBackground = useThemeColor({ colorName: 'buttonBackground' });
    const textColor = useThemeColor({ colorName: 'buttonText' });
    
    return (
        <View style={{ ...styles.eventBlockContainer, backgroundColor: eventBlockBackground }}>
            <Text style={{ ...styles.eventBlockTitle, color: textColor }}>{event.name}</Text>
            <View style={{ flex: 1 }} />
            <Text style={{ color: textColor }}>{event.start.hour}:{event.start.minute}-{event.end.hour}:{event.end.minute}</Text>
            <PencilIcon style={styles.icon} color={textColor} />
            <TrashIcon style={styles.icon} color={textColor} />
        </View>
    )
}

const styles = StyleSheet.create({
    eventBlockContainer: {
        width: '100%',
        padding: 10,
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
    },
    eventBlockTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        marginLeft: 10,
    }
})