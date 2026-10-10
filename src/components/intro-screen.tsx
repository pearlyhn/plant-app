import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Face } from '@/components/face';
import { P } from '@/lib/palette';

// Flat, shape-based splash like the reference: big black/green blobs + a friendly flower.
export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.art}>
        <View style={[styles.dot, { backgroundColor: '#8EC5F0', width: 26, height: 26, top: 24, left: 30 }]} />
        <View style={[styles.dot, { backgroundColor: '#F6B7A2', width: 22, height: 22, bottom: 40, left: 24 }]} />
        <View style={[styles.dot, { backgroundColor: P.white, width: 34, height: 34, top: 90, right: 20, opacity: 0.6 }]} />

        <View style={[styles.half, { backgroundColor: P.ink, top: 20, right: 40, transform: [{ rotate: '14deg' }] }]} />
        <View style={[styles.half, { backgroundColor: P.limeDark, top: 120, left: 40, transform: [{ rotate: '-12deg' }] }]} />
        <View style={[styles.half, { backgroundColor: P.ink, top: 215, right: 70, width: 140, height: 70, transform: [{ rotate: '24deg' }] }]} />

        <View style={styles.faceWrap}>
          <Face size={130} mood="happy" />
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.brand}>SPROUT</Text>
        <Text style={styles.tag}>Your plant, always in view.</Text>
        <Pressable onPress={onStart} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}>
          <Text style={styles.btnText}>Let's start  →</Text>
        </Pressable>
        <Text style={styles.fine}>Watch it grow, track its water, and water from anywhere.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: P.mint },
  art: { flex: 1, margin: 14, borderRadius: 36, backgroundColor: P.lime, overflow: 'hidden' },
  dot: { position: 'absolute', borderRadius: 20 },
  half: {
    position: 'absolute', width: 190, height: 95, borderTopLeftRadius: 95, borderTopRightRadius: 95,
  },
  faceWrap: {
    position: 'absolute', alignSelf: 'center', bottom: 28, backgroundColor: P.mint, borderRadius: 100,
    padding: 18,
  },
  bottom: { alignItems: 'center', paddingHorizontal: 28, paddingBottom: 24, gap: 10 },
  brand: { fontSize: 40, fontWeight: '900', letterSpacing: 4, color: P.ink },
  tag: { fontSize: 16, color: P.mute, fontWeight: '600' },
  btn: { marginTop: 8, backgroundColor: P.ink, borderRadius: 40, paddingVertical: 18, paddingHorizontal: 54 },
  btnText: { color: P.lime, fontSize: 18, fontWeight: '800' },
  fine: { textAlign: 'center', color: P.mute, fontSize: 12, marginTop: 4 },
});
