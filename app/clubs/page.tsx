'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  Clock,
  Flame,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  Navigation,
  ExternalLink,
  RotateCcw,
  Send,
  Building2
} from 'lucide-react';
import LiveCrowdBadge from '@/components/LiveCrowdBadge';
import PredictiveCrowdModal from '@/components/PredictiveCrowdModal';
import { ScrollReveal } from '@/components/Motion';
import { motion, AnimatePresence } from 'framer-motion';
import { INDONESIA_50_CLUBS, NationalClub } from '@/lib/national-gym-data';

export default function ClubsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedFacility, setSelectedFacility] = useState('ALL');
  const [forecastClub, setForecastClub] = useState<NationalClub | null>(null);

  const cities = ['ALL', 'Jakarta', 'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Bandung', 'Surabaya', 'Bali', 'Medan', 'Yogyakarta', 'Makassar'];

  const filteredClubs = useMemo(() => {
    return INDONESIA_50_CLUBS.filter((club) => {
      const matchSearch =
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.zone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCity =
        selectedCity === 'ALL' ||
        club.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
        club.zone.toLowerCase().includes(selectedCity.toLowerCase());

      const matchFacility =
        selectedFacility === 'ALL' ||
        club.facilities.some((f) => f.toLowerCase().includes(selectedFacility.toLowerCase()));

      return matchSearch && matchCity && matchFacility;
    });
  }, [searchQuery, selectedCity, selectedFacility]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('ALL');
    setSelectedFacility('ALL');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <ScrollReveal className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-volt uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>{t.clubs.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-textPrimary tracking-tight">
          {t.clubs.title}
        </h1>
        <p className="text-sm sm:text-base text-textMuted max-w-2xl leading-relaxed">
          {t.clubs.subtitle}
        </p>
      </ScrollReveal>

      {/* Filter & Search Bar */}
      <ScrollReveal delay={0.1} className="p-6 rounded-3xl bg-surface border border-border space-y-5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-textMuted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.clubs.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-background border border-border text-textPrimary placeholder:text-textMuted text-sm focus:outline-none focus:border-volt transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-textMuted hover:text-textPrimary"
              >
                ✕
              </button>
            )}
          </div>

          {/* Facility Filter Dropdown */}
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            aria-label="Filter Fasilitas"
            className="px-4 py-3.5 rounded-2xl bg-background border border-border text-xs font-mono text-textPrimary focus:outline-none focus:border-volt cursor-pointer"
          >
            <option value="ALL">{t.clubs.allFacilities}</option>
            <option value="Sauna">Sauna</option>
            <option value="Studio Pilates">Studio Pilates</option>
            <option value="Cycling Studio">Cycling Studio</option>
            <option value="Ice Bath">Ice Bath</option>
            <option value="Boxing">Boxing Ring</option>
          </select>
        </div>

        {/* City Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {cities.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`relative px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected ? 'text-black font-bold' : 'text-textMuted hover:text-textPrimary bg-elevated/80 hover:bg-elevated'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="city-pill"
                    className="absolute inset-0 bg-volt rounded-xl glow-volt"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{city === 'ALL' ? t.clubs.allCities : city}</span>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Results Header with Reset Action */}
      <div className="flex items-center justify-between text-xs font-mono text-textMuted">
        <div className="flex items-center gap-3">
          <span>{t.clubs.showing} <strong className="text-textPrimary">{filteredClubs.length}</strong> {t.clubs.activeBranches}</span>
          {(searchQuery || selectedCity !== 'ALL' || selectedFacility !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-volt hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
        <span className="text-cyan font-bold">● {t.clubs.sensorOnline}</span>
      </div>

      {/* Empty State if 0 Results */}
      {filteredClubs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 sm:p-16 rounded-3xl bg-surface border border-border text-center space-y-6 max-w-xl mx-auto shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-elevated border border-border text-textMuted flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-volt" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-display font-extrabold text-textPrimary">
              Cabang Belum Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-textMuted font-mono leading-relaxed">
              Tidak ada cabang KINETIC yang cocok dengan filter atau kata kunci &quot;<span className="text-volt">{searchQuery || selectedCity}</span>&quot;.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-volt text-black font-display font-extrabold text-xs uppercase tracking-wider glow-volt hover:bg-[#b8ea29] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Lihat Seluruh 50 Cabang</span>
            </button>

            <a
              href={`https://wa.me/628119281001?text=${encodeURIComponent(`Halo KINETIC, saya ingin mengajukan pembukaan cabang baru di daerah ${searchQuery || selectedCity || 'saya'}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-cyan flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-cyan" />
              <span>Request Cabang di Kotamu</span>
            </a>
          </div>
        </motion.div>
      ) : (
        /* Clubs Grid */
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredClubs.slice(0, 15).map((club) => {
              const googleMapsQuery = encodeURIComponent(`${club.name} ${club.address}`);
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapsQuery}`;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={club.id}
                  className="p-6 rounded-3xl bg-surface border border-border space-y-5 hover:border-volt/40 transition-colors flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-4">
                    {/* Card Header: Name & Live Crowd */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-display font-extrabold text-textPrimary group-hover:text-volt transition-colors leading-snug">
                          {club.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-textMuted mt-1">
                          <MapPin className="w-3.5 h-3.5 text-volt shrink-0" />
                          <span>{club.city} ({club.zone})</span>
                        </div>
                      </div>
                      <LiveCrowdBadge level={club.crowdLevel} occupancyPct={club.capacityPct} />
                    </div>

                    {/* Club Facility Photo Preview */}
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border relative">
                      <Image
                        src={
                          parseInt(club.id.replace('cl_', '')) % 4 === 0 ? '/images/facility-sauna.jpg' :
                          parseInt(club.id.replace('cl_', '')) % 4 === 1 ? '/images/class-bodypump.jpg' :
                          parseInt(club.id.replace('cl_', '')) % 4 === 2 ? '/images/class-yoga.jpg' :
                          '/images/facility-weights.jpg'
                        }
                        alt={club.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan border border-cyan/30">
                        {club.facilities[0]}
                      </div>

                      {/* Direct Map Pin Icon Shortcut */}
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Buka ${club.name} di Google Maps`}
                        title="Buka Navigasi Google Maps"
                        className="absolute bottom-2 right-2 p-2 rounded-xl bg-black/80 hover:bg-volt hover:text-black text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-textMuted leading-relaxed line-clamp-2">
                      {club.address}
                    </p>

                    {/* Hours & Distance */}
                    <div className="flex items-center justify-between text-xs font-mono text-textMuted pt-1 border-t border-border/60">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan" />
                        <span>{club.openHours}</span>
                      </div>
                      <span className="text-volt font-bold">{club.distanceKm} km</span>
                    </div>

                    {/* Facility Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {club.facilities.map((fac) => (
                        <span
                          key={fac}
                          className="px-2.5 py-1 rounded-lg bg-background text-[11px] font-mono text-textMuted border border-border"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 border-t border-border flex items-center gap-2">
                    {/* Predictive Forecast Modal Trigger */}
                    <button
                      onClick={() => setForecastClub(club)}
                      className="flex-1 py-2.5 rounded-xl bg-elevated hover:bg-surface border border-border text-xs font-mono text-cyan flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-volt" />
                      <span>{t.clubs.predictCrowd}</span>
                    </button>

                    <Link
                      href="/classes"
                      className="px-4 py-2.5 rounded-xl bg-volt text-black font-display font-extrabold text-xs hover:bg-[#b8ea29] transition-all glow-volt flex items-center gap-1 uppercase tracking-wider"
                    >
                      <span>{t.clubs.bookSpot}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Predictive Crowd & Navigation Modal Popup */}
      {forecastClub && (
        <PredictiveCrowdModal
          club={forecastClub}
          onClose={() => setForecastClub(null)}
        />
      )}
    </div>
  );
}
