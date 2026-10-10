import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Face } from '@/components/face';
import { dayKey, eventsByDay, moodFor } from '@/lib/dates';
import { P } from '@/lib/palette';
import { useSettings } from '@/lib/settings';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const { events, addEvent, profile } = useSettings();
  const { width } = useWindowDimensions();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);

  const byDay = useMemo(() => eventsByDay(events), [events]);
  const cell = Math.min(width - 32, 560) / 7;

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = new Date(year, month, 1).getDay();
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const inMonth = events.filter((e) => {
    const d = new Date(e.t);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const dayCount = (kind: 'water' | 'dry') => new Set(inMonth.filter((e) => e.kind === kind).map((e) => dayKey(new Date(e.t)))).size;
  const waterings = inMonth.filter((e) => e.kind === 'water').length;
  const thirsty = dayCount('dry');

  const lastWater = events.filter((e) => e.kind === 'water').map((e) => e.t);
  const sinceDays = lastWater.length
    ? Math.floor((Date.now() - Math.max(...lastWater)) / 86400000)
    : null;

  const selEvents = (byDay[dayKey(selected)] ?? []).sort((a, b) => a.t - b.t);
  const selLabel = selected.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  const sameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);

  const shift = (n: number) => setCursor(new Date(year, month + n, 1));

  return (
    <View style={styles.root}>
      {/* decorative hills */}
      <View style={styles.hillBack} />
      <View style={styles.hillFront} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title}>{profile.name ? `${profile.name}'s journal` : 'Watering journal'}</Text>
          </View>

          <View style={styles.monthRow}>
            <Pressable onPress={() => shift(-1)} style={styles.arrow}><Text style={styles.arrowText}>‹</Text></Pressable>
            <Text style={styles.month}>{year}.{String(month + 1).padStart(2, '0')}</Text>
            <Pressable onPress={() => shift(1)} style={styles.arrow}><Text style={styles.arrowText}>›</Text></Pressable>
          </View>

          <View style={{ alignSelf: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              {DOW.map((d) => (
                <Text key={d} style={[styles.dow, { width: cell }]}>{d}</Text>
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: cell * 7 }}>
              {cells.map((d, i) =>
                d ? (
                  <Pressable key={i} onPress={() => setSelected(d)} style={{ width: cell, alignItems: 'center', paddingVertical: 4 }}>
                    <Face size={cell * 0.8} mood={moodFor(d, byDay, today)} />
                    <View style={[styles.num, sameDay(d, today) && styles.numToday, sameDay(d, selected) && styles.numSel]}>
                      <Text style={[styles.numText, sameDay(d, today) && { color: P.white }]}>{d.getDate()}</Text>
                    </View>
                  </Pressable>
                ) : (
                  <View key={i} style={{ width: cell }} />
                ),
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.stat, { backgroundColor: P.ink }]}>
              <Text style={[styles.statNum, { color: P.lime }]}>{waterings}</Text>
              <Text style={styles.statLabel}>Waterings</Text>
            </View>
            <View style={[styles.stat, { backgroundColor: P.lime }]}>
              <Text style={styles.statNum}>{thirsty}</Text>
              <Text style={[styles.statLabel, { color: P.ink }]}>Thirsty days</Text>
            </View>
            <View style={[styles.stat, { backgroundColor: P.white }]}>
              <Text style={styles.statNum}>{sinceDays === null ? '–' : sinceDays}</Text>
              <Text style={[styles.statLabel, { color: P.ink }]}>Days since water</Text>
            </View>
          </View>

          <View style={styles.detail}>
            <Text style={styles.detailTitle}>{selLabel}</Text>
            {selEvents.length === 0 ? (
              <Text style={styles.detailText}>Nothing logged.</Text>
            ) : (
              selEvents.map((e, i) => (
                <Text key={i} style={styles.detailText}>
                  {e.kind === 'water' ? '💧 Watered' : '🥀 Soil got dry'} ·{' '}
                  {new Date(e.t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Text>
              ))
            )}
          </View>

          <Pressable onPress={() => addEvent('water')} style={({ pressed }) => [styles.logBtn, pressed && { opacity: 0.8 }]}>
            <Text style={styles.logText}>+  Log a watering today</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: P.sky },
  hillBack: { position: 'absolute', bottom: -230, left: -80, width: 420, height: 420, borderRadius: 210, backgroundColor: P.limeDark, opacity: 0.8 },
  hillFront: { position: 'absolute', bottom: -260, right: -100, width: 520, height: 420, borderRadius: 260, backgroundColor: P.lime },
  content: { padding: 16, gap: 14, paddingBottom: 120 },
  topRow: { flexDirection: 'row', justifyContent: 'center' },
  title: { backgroundColor: P.white, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, fontWeight: '800', color: P.ink, overflow: 'hidden' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  month: { fontSize: 22, fontWeight: '800', color: '#4B5B66' },
  arrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 22, fontWeight: '800', color: P.ink, marginTop: -2 },
  dow: { textAlign: 'center', color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 12, marginBottom: 4 },
  num: { marginTop: 2, minWidth: 24, height: 20, paddingHorizontal: 6, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  numToday: { backgroundColor: '#2F9E5B' },
  numSel: { borderWidth: 2, borderColor: P.ink },
  numText: { fontSize: 12, fontWeight: '800', color: '#4B5B66' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  stat: { flex: 1, borderRadius: 22, padding: 14, gap: 2 },
  statNum: { fontSize: 30, fontWeight: '900', color: P.ink },
  statLabel: { fontSize: 11, fontWeight: '700', color: P.limeSoft },
  detail: { backgroundColor: P.white, borderRadius: 22, padding: 16, gap: 6 },
  detailTitle: { fontWeight: '900', fontSize: 16, color: P.ink },
  detailText: { color: P.inkSoft, fontSize: 14 },
  logBtn: { backgroundColor: P.ink, borderRadius: 40, paddingVertical: 18, alignItems: 'center' },
  logText: { color: P.lime, fontSize: 16, fontWeight: '800' },
});
