import ActionButton from "@/components/ui/action-button";
import { Pressable } from "react-native";

export default function HomePage() {
    return (
        <div>
            <div>Hello!</div>

            <ActionButton title="Press me" onPress={() => alert('Pressed!')} />
        </div>
    );
}