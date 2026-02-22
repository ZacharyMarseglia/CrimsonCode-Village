import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

export default function ModalScreen({ title, contents }: { title: string; contents: string }) {
  const dismissModal = () => {
    router.back();
  };
  
  return (
    <ThemedView style={[styles.container, { display: 'none' }]}>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedText>{contents}</ThemedText>
      <Pressable style={styles.link} onPress={dismissModal}>
        <ThemedText type="link">Dismiss</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
