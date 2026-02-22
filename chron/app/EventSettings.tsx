import ActionButton from "@/components/ui/ActionButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, View, Text } from "react-native"
import React, { useEffect } from "react";
import { DevPlatform } from "@/services/platform/DevPlatform";
import { EventManager, MemoryEventStore, Event } from "@/services/events/events";
import { ConsoleLogger } from "@/services/logging/ConsoleLogger";
import EventBlock from "./EventBlock";

export default function EventSettings({setVisible}: { setVisible: (visible: boolean) => void }) {
    const textColor = useThemeColor({ colorName: 'text' });
    const iconColor = useThemeColor({ colorName: 'iconDark' });
    
    const eventManager = new EventManager(new DevPlatform(), new ConsoleLogger(), new MemoryEventStore());

    const [events, setEvents] = React.useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            setEvents(await eventManager.listEvents());
        };
        fetchEvents();
    }, []);

    return (
        <View>
            <ActionButton
                title={
                    <View style={{ ...styles.backButton }}>
                        <ArrowLeft color={iconColor} />
                        <Text style={{ color: textColor }}> Back</Text>
                    </View>
                }
                onPress={() => setVisible(false)}>
            </ActionButton>
            {
                events.map((event : Event) => (
                    <EventBlock event={event} />
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})