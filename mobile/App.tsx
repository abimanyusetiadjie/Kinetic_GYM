import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'QR' | 'SCHEDULE' | 'STREAK'>('QR');
  const [seconds, setSeconds] = useState(15);
  const [qrToken, setQrToken] = useState('KNT-9281-PASS-ACTIVE');

  // TOTP 15-second rotation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setQrToken('KNT-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-PASS');
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0D14" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>KINETIC<Text style={{ color: '#CAFF33' }}>.</Text></Text>
          <Text style={styles.subTitle}>Halo, Budi Pratama • Pro All Club</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>8 WEEKS 🔥</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'QR' && (
          <View style={styles.qrCard}>
            <Text style={styles.qrHeader}>ACCESS GATE PASS</Text>
            <Text style={styles.qrClub}>SUDIRMAN SCBD • ALL CLUB</Text>
            
            {/* QR Box */}
            <View style={styles.qrBox}>
              <Text style={{ color: '#CAFF33', fontSize: 32, fontWeight: 'bold' }}>[ 🔳 QR ]</Text>
              <Text style={{ color: '#94A3B8', fontSize: 10, marginTop: 8 }}>{qrToken}</Text>
            </View>

            {/* Countdown */}
            <View style={styles.timerRow}>
              <Text style={styles.timerText}>Auto-Refresh: {seconds} detik</Text>
            </View>

            <Text style={styles.instruction}>
              * Kecerahan layar HP otomatis 100%. Dekatkan ke scanner turnstile gerbang.
            </Text>
          </View>
        )}

        {activeTab === 'SCHEDULE' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Jadwal Kelas Saya Hari Ini</Text>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleName}>Les Mills BodyPump (Spot: Mat A2)</Text>
              <Text style={styles.scheduleDetail}>18:30 WIB • Studio 1 • Coach Sarah Jenkins</Text>
            </View>
          </View>
        )}

        {activeTab === 'STREAK' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Consistency Streak Tracker 🔥</Text>
            <Text style={styles.streakCount}>8 Minggu Berturut-turut!</Text>
            <Text style={styles.streakReward}>Diskon 10% Aktif untuk Perpanjangan Berikutnya.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity
          onPress={() => setActiveTab('QR')}
          style={[styles.tabButton, activeTab === 'QR' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'QR' && styles.tabTextActive]}>📱 QR Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('SCHEDULE')}
          style={[styles.tabButton, activeTab === 'SCHEDULE' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'SCHEDULE' && styles.tabTextActive]}>🗓️ Jadwal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('STREAK')}
          style={[styles.tabButton, activeTab === 'STREAK' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, activeTab === 'STREAK' && styles.tabTextActive]}>🔥 Streak</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(202, 255, 51, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(202, 255, 51, 0.4)',
  },
  badgeText: {
    color: '#CAFF33',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  qrHeader: {
    color: '#00E5FF',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  qrClub: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  qrBox: {
    width: 200,
    height: 200,
    backgroundColor: '#0A0D14',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  timerRow: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timerText: {
    color: '#CAFF33',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instruction: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scheduleItem: {
    backgroundColor: '#1A2235',
    padding: 14,
    borderRadius: 14,
  },
  scheduleName: {
    color: '#CAFF33',
    fontSize: 13,
    fontWeight: 'bold',
  },
  scheduleDetail: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  streakCount: {
    fontSize: 20,
    color: '#FF5E1E',
    fontWeight: 'bold',
    marginVertical: 6,
  },
  streakReward: {
    color: '#CAFF33',
    fontSize: 12,
  },
  bottomTabs: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#CAFF33',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
});
