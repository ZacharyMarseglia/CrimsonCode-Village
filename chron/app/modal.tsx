import { Pressable, StyleSheet } from 'react-native';

import { router } from 'expo-router';

export default function ModalScreen({ title, contents }: { title: string; contents: string }) {
  const dismissModal = () => {
    router.back();
  };
  
  return (
    <div style={styles.container}>
      <h1>{title}</h1>
      <p>{contents}</p>
      <Pressable onPress={dismissModal} style={styles.link}>
        <div>Dismiss</div>
      </Pressable>
    </div>
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
