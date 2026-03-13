import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, PartyPopper, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Segment = {
  label: string;
  color: string;
};

const segments: Segment[] = [
  { label: "Mini Candle", color: "#f59e0b" },
  { label: "Keychain", color: "#9333ea" },
  { label: "50 TL İndirim", color: "#2563eb" },
  { label: "Socks", color: "#ef4444" },
  { label: "Sürpriz Hediye", color: "#22c55e" },
  { label: "Altın Bonus", color: "#fbbf24" },
  { label: "Şans Bonusu", color: "#f97316" },
  { label: "Mavi Bonus", color: "#3b82f6" },
  { label: "Sticker Set", color: "#ef4444" },
  { label: "Tatlı Çikolata", color: "#7c3aed" },
  { label: "Lavanta Kesesi", color: "#10b981" },
  { label: "Mini Candle", color: "#fb923c" },
];

const prizeWeights = [12, 10, 8, 7, 4, 4, 5, 5, 10, 9, 9, 8];
const segmentAngle = 360 / segments.length;

function pickWeightedIndex(): number {
  const total = prizeWeights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * total;

  for (let i = 0; i < prizeWeights.length; i += 1) {
    random -= prizeWeights[i];
    if (random <= 0) return i;
  }

  return 0;
}

function buildWheelBackground(): string {
  const stops = segments
    .map((segment, index) => {
      const start = index * segmentAngle;
      const end = (index + 1) * segmentAngle;
      return `${segment.color} ${start}deg ${end}deg`;
    })
    .join(", ");

  return `conic-gradient(${stops})`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function splitLabel(label: string): string[] {
  return label.split(" ");
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 28 }, (_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => {
        const left = 12 + ((piece * 17) % 76);
        const delay = (piece % 8) * 0.08;
        const duration = 1.8 + (piece % 5) * 0.18;
        const rotate = piece * 21;
        const shape = piece % 3 === 0 ? "rounded-full" : "rounded-sm";
        const colors = ["bg-yellow-300", "bg-red-400", "bg-blue-400", "bg-green-400", "bg-pink-400", "bg-orange-300"];

        return (
          <motion.div
            key={piece}
            initial={{ y: -40, x: 0, opacity: 0, rotate: 0, scale: 0.6 }}
            animate={{
              y: 420 + (piece % 7) * 20,
              x: (piece % 2 === 0 ? 1 : -1) * (30 + (piece % 6) * 14),
              opacity: [0, 1, 1, 0],
              rotate: rotate + 220,
              scale: [0.6, 1, 1],
            }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={`absolute top-0 h-3 w-2 ${shape} ${colors[piece % colors.length]}`}
            style={{ left: `${left}%` }}
          />
        );
      })}
    </div>
  );
}

export default function EtsyWheelGiftSite() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [spinCount, setSpinCount] = useState(0);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const wheelBackground = useMemo(() => buildWheelBackground(), []);

  const spinWheel = () => {
    if (isSpinning) return;

    if (!orderNumber.trim()) {
      setResult("Önce Etsy sipariş numaranızı girin ✨");
      return;
    }

    if (spinCount >= 1) {
      setResult("Demo sürümünde sipariş başına 1 çevirme hakkı var 🎁");
      return;
    }

    setIsSpinning(true);
    setResult("");
    setShowConfetti(false);

    const pickedIndex = pickWeightedIndex();
    const centerOfWinningSegment = pickedIndex * segmentAngle + segmentAngle / 2;
    const extraTurns = 360 * (6 + Math.floor(Math.random() * 2));
    const finalRotation = rotation + extraTurns + (360 - centerOfWinningSegment);

    setWinnerIndex(pickedIndex);
    setRotation(finalRotation);

    window.setTimeout(() => {
      setIsSpinning(false);
      setSpinCount(1);
      setResult(`🎉 Sürpriz hediyeniz: ${segments[pickedIndex].label}`);
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 2400);
    }, 6200);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f245c] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#53a2ff_0%,#1c4ea8_32%,#101f4a_62%,#080d1d_100%)]" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1887&auto=format&fit=crop')] bg-cover bg-center opacity-25 mix-blend-screen" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_35%,rgba(255,162,0,0.12))]" />

      <div className="pointer-events-none absolute left-6 top-8 h-28 w-20 rounded-[50%] bg-gradient-to-b from-orange-200 to-red-500 opacity-90 shadow-[0_0_30px_rgba(251,146,60,0.5)] md:h-40 md:w-28" />
      <div className="pointer-events-none absolute left-[12%] top-[14%] h-16 w-12 rounded-[50%] bg-gradient-to-b from-pink-200 to-orange-500 opacity-90 shadow-[0_0_24px_rgba(251,146,60,0.4)]" />
      <div className="pointer-events-none absolute right-8 top-12 h-20 w-20 rounded-full bg-yellow-200/80 blur-md" />

      <div className="pointer-events-none absolute inset-x-0 top-8 h-16 bg-[radial-gradient(circle,rgba(255,230,138,0.95)_1.5px,transparent_2px)] [background-size:44px_10px]" />
      <motion.div
        animate={{ opacity: [0.35, 0.95, 0.35] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-x-0 top-8 h-16 bg-[radial-gradient(circle,rgba(255,180,60,1)_2px,transparent_2px)] [background-size:86px_12px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mb-4 max-w-4xl text-center">
          <div className="relative mx-auto inline-block rounded-[36px] border-[4px] border-amber-300 bg-[linear-gradient(180deg,#8a4218,#502306)] px-8 py-5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] md:px-14 md:py-8">
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border-[8px] border-transparent [background:linear-gradient(#0000,#0000)_padding-box,radial-gradient(circle,rgba(255,220,102,1)_0_38%,rgba(0,0,0,0)_40%)_border-box] [background-size:42px_42px]" />
            <div className="relative">
              <div className="text-5xl font-black tracking-tight text-yellow-200 drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)] md:text-7xl">Can&apos;s</div>
              <div className="mt-1 text-xl font-extrabold tracking-[0.18em] text-yellow-100 md:text-4xl">HANDMADE STORE</div>
            </div>
          </div>
        </motion.div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative flex min-h-[650px] items-center justify-center">
            <AnimatePresence>{showConfetti ? <ConfettiBurst /> : null}</AnimatePresence>

            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="relative">
              <div className="absolute -top-16 left-1/2 z-30 -translate-x-1/2">
                <div className="relative flex flex-col items-center">
                  <div className="h-0 w-0 border-l-[28px] border-r-[28px] border-t-[50px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
                  <div className="-mt-1 h-3 w-8 rounded-b-full bg-yellow-300 shadow-[0_0_14px_rgba(253,224,71,0.8)]" />
                </div>
              </div>

              <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full border-[12px] border-yellow-200 bg-[radial-gradient(circle,#fef3c7_0%,#f59e0b_10%,#6d3b09_100%)] shadow-[0_0_90px_rgba(251,191,36,0.28)] md:h-[560px] md:w-[560px]">
                {[...Array(48)].map((_, i) => {
                  const angle = (360 / 48) * i;
                  const translateDistance = 176;
                  return (
                    <motion.div
                      key={i}
                      animate={{ opacity: i % 2 === 0 ? [0.4, 1, 0.4] : [1, 0.45, 1] }}
                      transition={{ duration: 0.9, delay: i * 0.02, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-1/2 top-1/2 h-3.5 w-3.5 rounded-full bg-yellow-200 shadow-[0_0_14px_rgba(253,224,71,0.95)] md:h-4 md:w-4"
                      style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${translateDistance}px)` }}
                    />
                  );
                })}

                <motion.div
                  animate={{ rotate: rotation }}
                  transition={isSpinning ? { duration: 6.2, ease: [0.08, 0.9, 0.12, 1] } : { duration: 0 }}
                  className="relative h-[300px] w-[300px] rounded-full border-[10px] border-amber-50 shadow-2xl md:h-[470px] md:w-[470px]"
                  style={{ background: wheelBackground }}
                >
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    {segments.map((segment, index) => {
                      const angle = index * segmentAngle + segmentAngle / 2;
                      const point = polarToCartesian(50, 50, 33, angle);
                      const rotationFix = angle > 90 && angle < 270 ? angle + 180 : angle;
                      const words = splitLabel(segment.label);

                      return (
                        <g key={`${segment.label}-${index}`}>
                          <text
                            x={point.x}
                            y={point.y}
                            fill="white"
                            fontSize="4.3"
                            fontWeight="900"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform={`rotate(${rotationFix}, ${point.x}, ${point.y})`}
                            style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.48))" }}
                          >
                            {words.map((word, wordIndex) => {
                              const startOffset = -(words.length - 1) * 2.3;
                              return (
                                <tspan key={`${word}-${wordIndex}`} x={point.x} dy={wordIndex === 0 ? startOffset : 4.6}>
                                  {word}
                                </tspan>
                              );
                            })}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {winnerIndex !== null && !isSpinning ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 rounded-full" /> : null}

                  <button
                    type="button"
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-8 border-yellow-200 bg-[radial-gradient(circle,#ff6b57_0%,#d91f11_78%,#8c140e_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.03] active:scale-[0.98] md:h-36 md:w-36"
                  >
                    <div className="text-center leading-tight">
                      <div className="text-sm font-black text-yellow-100 drop-shadow md:text-2xl">ÇEVİR!</div>
                      <Gift className="mx-auto mt-1 h-5 w-5 text-yellow-200 md:h-7 md:w-7" />
                    </div>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div>
            <Card className="rounded-[28px] border-white/10 bg-white/10 text-white backdrop-blur-xl shadow-2xl">
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-slate-100">
                    <Ticket className="h-4 w-4" />
                    Surprise Gift Claim
                  </div>
                  <h2 className="text-2xl font-bold md:text-3xl">Sipariş bonus çarkını çevir</h2>
                  <p className="text-sm leading-6 text-slate-200">Etsy sipariş numaranı gir, 1 kez çevir ve paketine eklenecek sürpriz hediyeyi gör.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-100">Etsy sipariş numarası</label>
                  <Input
                    value={orderNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderNumber(e.target.value)}
                    placeholder="Örnek: 1234567890"
                    className="h-12 rounded-2xl border-white/15 bg-white/10 text-white placeholder:text-slate-300"
                  />
                </div>

                <Button onClick={spinWheel} disabled={isSpinning} className="h-14 w-full rounded-2xl bg-yellow-400 text-lg font-bold text-slate-900 shadow-[0_12px_30px_rgba(250,204,21,0.35)] hover:bg-yellow-300">
                  {isSpinning ? "Çevriliyor..." : "Çarkı Çevir"}
                </Button>

                <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-yellow-200">
                    <PartyPopper className="h-4 w-4" />
                    <span className="font-semibold">Sonuç</span>
                  </div>
                  <p className="min-h-[48px] text-sm leading-6 text-slate-100">{result || "Çevirme sonrası sürpriz ödül burada görünecek."}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="font-semibold text-yellow-200">1 çevirme</div>
                    <div className="mt-1 text-slate-200">Her sipariş numarası için</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="font-semibold text-yellow-200">Sürpriz hediyeler</div>
                    <div className="mt-1 text-slate-200">Sipariş paketine eklenir</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-amber-200/10 p-3 text-xs text-amber-100">
                  <Sparkles className="h-4 w-4" />
                  Demo notu: üretimde sipariş doğrulama ve sonuç kayıtları veritabanına yazılmalıdır.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
