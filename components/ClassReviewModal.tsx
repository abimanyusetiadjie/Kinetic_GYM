'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';

type ClassReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  instructorName: string;
};

export default function ClassReviewModal({ isOpen, onClose, className, instructorName }: ClassReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableTags = ['Teknik Jelas', 'Musik Enerjik', 'Motivator Hebat', 'Studio Bersih', 'Terlalu Penuh'];

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Harap berikan rating bintang (1-5).');
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setRating(0);
        setReviewText('');
        setTags([]);
        onClose();
      }, 2500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-elevated text-textMuted hover:text-textPrimary cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-volt/20 text-volt border border-volt/40 flex items-center justify-center glow-volt">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-extrabold text-textPrimary mt-4">Terima Kasih!</h3>
            <p className="text-sm text-textMuted font-mono px-4">
              Ulasan Anda sangat berarti untuk meningkatkan kualitas KINETIC.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="text-xs font-mono text-cyan uppercase mb-1">Beri Ulasan Sesi Selesai</div>
              <h3 className="text-xl font-display font-extrabold text-textPrimary leading-tight">
                {className}
              </h3>
              <p className="text-xs text-textMuted font-mono mt-1">bersama {instructorName}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-textPrimary font-bold">Bagaimana kelasnya?</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'fill-volt text-volt glow-volt'
                          : 'fill-transparent text-border'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-textPrimary font-bold">Pilih kesan yang sesuai</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all cursor-pointer ${
                      tags.includes(tag)
                        ? 'bg-cyan text-black border-cyan font-bold'
                        : 'bg-elevated/50 border-border text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono text-textPrimary font-bold">Ulasan tambahan (Opsional)</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Pelatihnya sangat memotivasi, tapi AC kurang dingin..."
                rows={3}
                className="w-full p-3 rounded-xl bg-background border border-border text-sm font-mono text-textPrimary focus:outline-none focus:border-volt resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-volt text-black font-display font-extrabold text-sm glow-volt hover:bg-[#b8ea29] transition-all"
            >
              Kirim Ulasan
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
