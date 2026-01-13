"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Check, CheckCheck, Star, Smile, ThumbsUp, Sparkles } from "lucide-react"

// Custom keyframes for animations
const customStyles = `
@keyframes typing-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-4px); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

@keyframes slide-up-fade {
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes satisfaction-pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes confetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes border-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes aurora-drift {
  0%, 100% {
    transform: translate(0%, 0%) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(10%, -10%) scale(1.1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-5%, 5%) scale(0.95);
    opacity: 0.5;
  }
  75% {
    transform: translate(-10%, -5%) scale(1.05);
    opacity: 0.7;
  }
}

@keyframes aurora-drift-2 {
  0%, 100% {
    transform: translate(0%, 0%) scale(1) rotate(0deg);
    opacity: 0.5;
  }
  33% {
    transform: translate(-15%, 10%) scale(1.15) rotate(60deg);
    opacity: 0.7;
  }
  66% {
    transform: translate(10%, -10%) scale(0.9) rotate(120deg);
    opacity: 0.4;
  }
}

@keyframes soft-pulse {
  0%, 100% { opacity: 0.4; filter: blur(40px); }
  50% { opacity: 0.6; filter: blur(50px); }
}

.message-glow {
  animation: slide-up-fade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.floating-orb {
  animation: float 6s ease-in-out infinite;
}

.pulse-orb {
  animation: pulse-glow 4s ease-in-out infinite;
}
`
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { Logo } from "@/components/Logo"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/AuthContext"

// Fake conversation data - Lord of the Rings themed
const conversationSets = [
  // Set 0 - The One Ring order
  {
    customerName: "Frodo Baggins",
    messages: [
      { from: "customer", text: "Hi, I ordered a replica of the One Ring but it hasn't arrived yet" },
      { from: "agent", text: "Hello Frodo! Let me look into that for you. Could you provide your order number?" },
      { from: "customer", text: "It's ORDER-SHIRE-001. I ordered it from Bag End" },
      { from: "agent", text: "Found it! Your order is currently with our courier - an eagle from the Misty Mountains. It should arrive by second breakfast tomorrow." },
      { from: "customer", text: "That's a relief! Is the inscription included?" },
      { from: "agent", text: "Yes! The Elvish inscription 'One Ring to rule them all' is engraved in the original Black Speech. Only visible when heated." },
      { from: "customer", text: "Perfect. Does it come with a chain?" },
      { from: "agent", text: "It includes a mithril chain, same as the one Bilbo used. Very lightweight but unbreakable!" },
      { from: "customer", text: "Wonderful! My uncle Bilbo will be so pleased" },
      { from: "agent", text: "I'm sure he will! Would you like gift wrapping? We use authentic Lothlórien leaf designs." },
      { from: "customer", text: "Yes please! That sounds lovely" },
      { from: "agent", text: "Done! I've added complimentary gift wrapping. Is there anything else you need?" },
      { from: "customer", text: "Does wearing it make you invisible?" },
      { from: "agent", text: "I cannot confirm or deny that feature. But I'd advise against wearing it near any dark lords!" },
      { from: "customer", text: "Haha, noted! Thank you for your help" },
      { from: "agent", text: "You're welcome, Frodo! May your path be ever green and golden. Safe travels!" },
    ]
  },
  // Set 1 - Gandalf's staff repair
  {
    customerName: "Gandalf Grey",
    messages: [
      { from: "customer", text: "My staff broke during a fight with a Balrog. Do you offer repairs?" },
      { from: "agent", text: "Gandalf! I heard about the Bridge of Khazad-dûm incident. I'm so sorry! Yes, we offer staff repairs." },
      { from: "customer", text: "Excellent. It's completely shattered I'm afraid" },
      { from: "agent", text: "No problem. For complete reconstructions, we use wood from the oldest Mallorn trees in Lothlórien." },
      { from: "customer", text: "Will it still channel my magic properly?" },
      { from: "agent", text: "Absolutely! Our craftsmen are trained by Celebrimbor's lineage. Your new staff will be even more powerful." },
      { from: "customer", text: "What about the crystal on top?" },
      { from: "agent", text: "We source our crystals from the Glittering Caves of Aglarond. Each one is imbued with the light of Eärendil." },
      { from: "customer", text: "That sounds perfect. How long will it take?" },
      { from: "agent", text: "Standard crafting takes 3 ages, but for Istari members, we offer express service - ready in 3 days!" },
      { from: "customer", text: "I'll take the express option. I have urgent business in Fangorn" },
      { from: "agent", text: "Understood! I've expedited your order. Shall we deliver to Fangorn Forest directly?" },
      { from: "customer", text: "Yes, I'll be with the Ents. Look for the tallest tree" },
      { from: "agent", text: "Noted! Our eagle courier knows Treebeard personally. Your staff will find you." },
      { from: "customer", text: "You shall have my gratitude!" },
      { from: "agent", text: "The honor is ours, Gandalf! May your flame never dim!" },
    ]
  },
  // Set 2 - Elven cloak return
  {
    customerName: "Samwise Gamgee",
    messages: [
      { from: "customer", text: "Hello, I need to return an Elven cloak. It's too big for a hobbit" },
      { from: "agent", text: "Hi Sam! No worries, we can help with that. Do you have your order number?" },
      { from: "customer", text: "It's LOTH-7749. Lady Galadriel gave it to us but it drags on the ground" },
      { from: "agent", text: "I see! Actually, these cloaks are enchanted to adjust to the wearer. Have you tried saying 'Namárië' while wearing it?" },
      { from: "customer", text: "Oh! Let me try... by the Shire, it fits perfectly now!" },
      { from: "agent", text: "Wonderful! The Elven tailoring magic sometimes needs a gentle activation. Is the color to your liking?" },
      { from: "customer", text: "It changes with the surroundings! That's incredible" },
      { from: "agent", text: "Yes! It's woven with threads that mirror your environment. Perfect for... gardening adventures." },
      { from: "customer", text: "Mr. Frodo will be so pleased. His fits too then?" },
      { from: "agent", text: "It should! Just have him speak the same phrase. Each cloak is bonded to its Fellowship recipient." },
      { from: "customer", text: "Can I wash it? We've been through some muddy places" },
      { from: "agent", text: "Elven fabric is self-cleaning! Just leave it under starlight for one night and it'll be fresh as new." },
      { from: "customer", text: "That's proper magical, that is! Thank you kindly" },
      { from: "agent", text: "You're most welcome, Sam! May your garden always bloom and your potatoes grow plenty!" },
    ]
  },
  // Set 3 - Mithril armor inquiry
  {
    customerName: "Gimli Son of Gloin",
    messages: [
      { from: "customer", text: "I'm looking for mithril armor. Do you have any in stock?" },
      { from: "agent", text: "Gimli, son of Glóin! Welcome! Mithril is extremely rare, but we do have a few pieces." },
      { from: "customer", text: "Excellent! What sizes are available?" },
      { from: "agent", text: "We have one dwarf-sized coat, originally from the Moria mines. Light as a feather, hard as dragon scales!" },
      { from: "customer", text: "Moria you say? My cousin Balin would be proud. What's the price?" },
      { from: "agent", text: "For a piece of this quality, we're asking the worth of the entire Shire. But for a hero of the Fellowship, 50% off!" },
      { from: "customer", text: "Ha! A fair deal. Does it come with a helmet?" },
      { from: "agent", text: "The set includes a mithril helm with ram horn decorations - classic Khazad-dûm style!" },
      { from: "customer", text: "Perfect for head-butting orcs! I'll take it" },
      { from: "agent", text: "Wonderful choice! Shall I have it engraved? We offer Khuzdul inscriptions." },
      { from: "customer", text: "Yes! Write 'Baruk Khazâd!' on the chest plate" },
      { from: "agent", text: "A fine battle cry! I'll add that at no extra charge. Delivery by mountain goat or eagle?" },
      { from: "customer", text: "Eagle. I have caves to explore with a certain elf" },
      { from: "agent", text: "Legolas, I presume? What a friendship! Your armor will arrive at the Glittering Caves within a fortnight!" },
      { from: "customer", text: "You have my axe... I mean, my thanks!" },
      { from: "agent", text: "And you have our service! May your beard grow ever longer!" },
    ]
  },
  // Set 4 - Lembas bread delivery
  {
    customerName: "Peregrin Took",
    messages: [
      { from: "customer", text: "Hi! I ordered 12 packs of Lembas bread but only received 8" },
      { from: "agent", text: "Hello Pippin! Let me check on that order. Oh my, it seems someone ate 4 packs during delivery!" },
      { from: "customer", text: "It wasn't me this time, I swear on the Green Dragon's ale!" },
      { from: "agent", text: "Ha! I believe you. Our courier notes say 'emergency hunger situation in Bree.' We'll send replacements right away." },
      { from: "customer", text: "Thank you! I need them for second breakfast supplies" },
      { from: "agent", text: "Of course! One bite is enough to fill a grown man. How many breakfasts are you planning?" },
      { from: "customer", text: "Seven. Hobbits need proper nutrition for adventures!" },
      { from: "agent", text: "Naturally! I'm adding 4 extra packs as an apology. Wrapped in fresh Mallorn leaves." },
      { from: "customer", text: "You're too kind! Does Lembas go well with mushrooms?" },
      { from: "agent", text: "An unconventional pairing, but Farmer Maggot's mushrooms would complement the honey notes beautifully!" },
      { from: "customer", text: "Now you're speaking my language! How long does Lembas stay fresh?" },
      { from: "agent", text: "Kept in the leaf wrapping, it stays fresh for months! Perfect for long journeys to Mordor... or the pub." },
      { from: "customer", text: "Mostly the pub. Thank you so much!" },
      { from: "agent", text: "Anytime, Pippin! May your pantry never be empty and your pints always full!" },
    ]
  },
  // Set 5 - Palantír support
  {
    customerName: "Aragorn Elessar",
    messages: [
      { from: "customer", text: "The Palantír I purchased is showing strange visions. Is this normal?" },
      { from: "agent", text: "King Aragorn! An honor. What kind of visions are you seeing?" },
      { from: "customer", text: "A flaming eye keeps appearing. Very unsettling during council meetings" },
      { from: "agent", text: "Ah, that's a known issue with pre-owned Palantíri. The previous user's... preferences... can linger." },
      { from: "customer", text: "Can it be reset to factory settings?" },
      { from: "agent", text: "Yes! You'll need to recalibrate it under the light of the Two Trees. We have a guide I can send." },
      { from: "customer", text: "The Two Trees are destroyed. Any alternatives?" },
      { from: "agent", text: "Good point! The light of Eärendil's star works too. Galadriel's phial would be perfect." },
      { from: "customer", text: "I'll ask Frodo if he still has it. What about the dark whispers?" },
      { from: "agent", text: "Those should stop after the reset. If not, try wrapping it in an Elven cloak when not in use." },
      { from: "customer", text: "Practical advice. Can I block certain callers?" },
      { from: "agent", text: "Absolutely! Go to Settings > Block Users > Add 'Sauron' and any Nazgûl contacts." },
      { from: "customer", text: "That's exactly what I needed. The kingdom thanks you!" },
      { from: "agent", text: "The honor is ours, my King! Long live the Reunited Kingdom of Gondor and Arnor!" },
    ]
  },
  // Set 6 - Ent-draught order
  {
    customerName: "Meriadoc Brandybuck",
    messages: [
      { from: "customer", text: "Do you sell that Ent-draught that makes you taller?" },
      { from: "agent", text: "Merry! Yes, we do! It's sourced directly from Treebeard's personal spring in Fangorn." },
      { from: "customer", text: "Brilliant! Pippin and I want to be the tallest hobbits in the Shire" },
      { from: "agent", text: "Currently you're both at 4'5\" - already record-breaking for hobbits! How much taller were you thinking?" },
      { from: "customer", text: "Just a few more inches. Enough to reach the top shelf at the Green Dragon" },
      { from: "agent", text: "Ha! A worthy goal. I recommend our 'Moderate Growth' package - adds 2-3 inches safely." },
      { from: "customer", text: "Perfect! Any side effects?" },
      { from: "agent", text: "You might develop a taste for sunlight and rainwater. Some customers report speaking more... slowly." },
      { from: "customer", text: "I already do that after a few pints! I'll take two bottles" },
      { from: "agent", text: "Excellent! One for you, one for Pippin. Shall I include our foot hair growth serum? Very popular with hobbits." },
      { from: "customer", text: "Our foot hair is already magnificent, thank you very much!" },
      { from: "agent", text: "My apologies! Your order will arrive via Huorn courier - don't be alarmed if a tree knocks on your door!" },
      { from: "customer", text: "This is the strangest and best shop ever. Thank you!" },
      { from: "agent", text: "We aim to please! May you always have a warm hearth and a tale to tell!" },
    ]
  },
  // Set 7 - Andúril reforging
  {
    customerName: "Legolas Greenleaf",
    messages: [
      { from: "customer", text: "I need arrows that can pierce Uruk-hai armor. What do you recommend?" },
      { from: "agent", text: "Prince Legolas! For Uruk-hai, I recommend our Galadhrim arrows with mithril tips." },
      { from: "customer", text: "How many can you deliver? I tend to go through them quickly" },
      { from: "agent", text: "I've seen the battle reports - very impressive counts! We can supply 500 per week." },
      { from: "customer", text: "I'll need at least 1000. Gimli and I have a competition going" },
      { from: "agent", text: "Ah yes, the famous kill count rivalry! I'll double your order. Do you need a new quiver as well?" },
      { from: "customer", text: "My current one is from Mirkwood. Does yours hold more?" },
      { from: "agent", text: "Our Lothlórien quiver is enchanted to hold 100 arrows while weighing like 20. Elf-magic at its finest!" },
      { from: "customer", text: "That would definitely give me an edge over the dwarf! I'll take one" },
      { from: "agent", text: "Excellent! Shall I include our bow string wax? Made from Ent sap, never snaps in cold weather." },
      { from: "customer", text: "Yes please. Gimli keeps dragging me to frozen caves" },
      { from: "agent", text: "The Glittering Caves? I hear they're beautiful. Your order will ship today via swift hawk!" },
      { from: "customer", text: "You have the gratitude of the Woodland Realm!" },
      { from: "agent", text: "And you have our finest arrows! May they fly true and your count ever grow!" },
    ]
  },
]

// Floating background orbs
function FloatingOrbs() {
  const orbs = useMemo(() => [
    { size: 300, x: '10%', y: '20%', delay: 0, color: 'from-blue-500/20 to-purple-500/20' },
    { size: 200, x: '70%', y: '60%', delay: 2, color: 'from-emerald-500/15 to-cyan-500/15' },
    { size: 150, x: '80%', y: '10%', delay: 4, color: 'from-pink-500/15 to-rose-500/15' },
    { size: 100, x: '20%', y: '70%', delay: 1, color: 'from-amber-500/10 to-orange-500/10' },
    { size: 180, x: '50%', y: '40%', delay: 3, color: 'from-violet-500/15 to-indigo-500/15' },
  ], [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} floating-orb blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// Chat header with online status
function ChatHeader({ customerName, avatarInitial }: { customerName: string; avatarInitial: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-semibold text-xs shadow-lg">
          {avatarInitial}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-xs truncate">{customerName}</h3>
        <p className="text-emerald-400 text-[10px] flex items-center gap-1">
          <span className="w-1 h-1 bg-emerald-400 rounded-full" />
          Online
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-amber-400/70" />
        <span className="text-[10px] text-white/40">AI</span>
      </div>
    </div>
  )
}

// Format time for message
function formatMessageTime(baseTime: Date, offsetMinutes: number): string {
  const time = new Date(baseTime.getTime() + offsetMinutes * 60000)
  return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// Reaction component
function MessageReaction({ type, delay }: { type: 'like' | 'love' | 'thanks'; delay: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!show) return null

  const icons = {
    like: <ThumbsUp className="w-3 h-3" />,
    love: <span>❤️</span>,
    thanks: <span>🙏</span>,
  }

  return (
    <div
      className="absolute -bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 text-xs"
      style={{ animation: 'satisfaction-pop 0.3s ease-out' }}
    >
      {icons[type]}
    </div>
  )
}

// Chat message component with smooth entrance animation
function ChatMessage({ message, isCustomer, customerName, isNew, timestamp, showSeen, reaction }: {
  message: string
  isCustomer: boolean
  customerName: string
  isNew?: boolean
  timestamp: string
  showSeen?: boolean
  reaction?: 'like' | 'love' | 'thanks'
}) {
  const [mounted, setMounted] = useState(!isNew)

  useEffect(() => {
    if (isNew) {
      const timer = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(timer)
    }
  }, [isNew])

  return (
    <div
      className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} ${isNew ? 'message-glow' : ''}`}
    >
      <div className="relative group">
        <div className={`max-w-[300px] rounded-xl px-3.5 py-2.5 shadow-md backdrop-blur-sm transition-all duration-300 ${
          isCustomer
            ? 'bg-white/10 text-white rounded-bl-sm border border-white/5'
            : 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm'
        } ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[9px] font-medium ${isCustomer ? 'text-white/50' : 'text-primary-foreground/60'}`}>
              {isCustomer ? customerName.split(' ')[0] : 'Support'}
            </span>
            <span className={`text-[8px] ${isCustomer ? 'text-white/30' : 'text-primary-foreground/40'}`}>
              {timestamp}
            </span>
          </div>
          <p className="text-xs leading-relaxed">{message}</p>
          {!isCustomer && showSeen && (
            <div className="flex justify-end mt-1">
              <CheckCheck className="w-3 h-3 text-sky-400" />
            </div>
          )}
        </div>
        {reaction && <MessageReaction type={reaction} delay={500} />}
      </div>
    </div>
  )
}

// Satisfaction rating component
function SatisfactionRating({ show }: { show: boolean }) {
  const [rating, setRating] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (show) {
      const timers = [1, 2, 3, 4, 5].map((star, i) =>
        setTimeout(() => setRating(star), 200 + i * 150)
      )
      const completeTimer = setTimeout(() => setComplete(true), 1200)
      return () => {
        timers.forEach(clearTimeout)
        clearTimeout(completeTimer)
      }
    }
  }, [show])

  if (!show) return null

  return (
    <div className="flex flex-col items-center gap-2 py-4" style={{ animation: 'slide-up-fade 0.5s ease-out' }}>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
        <p className="text-white/50 text-[10px] text-center mb-2">Rate your experience</p>
        <div className="flex gap-0.5 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 transition-all duration-300 ${
                star <= rating
                  ? 'text-amber-400 fill-amber-400 scale-110'
                  : 'text-white/20'
              }`}
              style={{
                animation: star <= rating ? 'satisfaction-pop 0.3s ease-out' : 'none',
              }}
            />
          ))}
        </div>
        {complete && (
          <p className="text-emerald-400 text-[10px] text-center mt-2 flex items-center justify-center gap-1">
            <Check className="w-2.5 h-2.5" />
            Thanks!
          </p>
        )}
      </div>
    </div>
  )
}

// Resolved banner
function ResolvedBanner({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div
      className="flex items-center justify-center gap-2 py-2"
      style={{ animation: 'slide-up-fade 0.4s ease-out' }}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
        <CheckCheck className="w-3 h-3 text-emerald-400" />
        <span className="text-emerald-400 text-[10px] font-medium">Resolved</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
    </div>
  )
}

// Typing indicator component with smooth entrance
function TypingIndicator({ isCustomer, customerName }: { isCustomer: boolean; customerName: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(timer)
  }, [])

  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} transition-all duration-400 ease-out ${
      mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
    }`}>
      <div className={`rounded-xl px-3 py-2 ${
        isCustomer
          ? 'bg-white/10 rounded-bl-sm'
          : 'bg-primary/80 rounded-br-sm'
      }`}>
        <div className={`text-[9px] font-medium mb-1 ${isCustomer ? 'text-white/50' : 'text-primary-foreground/60'}`}>
          {isCustomer ? customerName.split(' ')[0] : 'Support'}
        </div>
        <div className="flex gap-1 py-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isCustomer ? 'bg-white/50' : 'bg-primary-foreground/60'}`}
            style={{ animation: 'typing-bounce 1s ease-in-out infinite', animationDelay: '0ms' }} />
          <span className={`w-1.5 h-1.5 rounded-full ${isCustomer ? 'bg-white/50' : 'bg-primary-foreground/60'}`}
            style={{ animation: 'typing-bounce 1s ease-in-out infinite', animationDelay: '200ms' }} />
          <span className={`w-1.5 h-1.5 rounded-full ${isCustomer ? 'bg-white/50' : 'bg-primary-foreground/60'}`}
            style={{ animation: 'typing-bounce 1s ease-in-out infinite', animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  )
}

// Generate realistic random typing delays based on message length
function getTypingDelay(message: string, isCustomer: boolean): number {
  const baseDelay = isCustomer ? 1800 : 1400 // Base thinking time
  const charDelay = Math.min(message.length * 20, 2000) // Typing time based on length
  const randomVariation = Math.random() * 800 - 400 // ±400ms random variation
  return Math.max(baseDelay + charDelay + randomVariation, 1500)
}

// Random pause between messages (simulates reading/thinking time)
function getReadingPause(): number {
  return 800 + Math.random() * 1500 // 0.8s to 2.3s pause
}

// Generate message timestamps
function generateTimestamps(messageCount: number): string[] {
  const baseTime = new Date()
  baseTime.setMinutes(baseTime.getMinutes() - messageCount * 2)

  const timestamps: string[] = []
  let currentOffset = 0

  for (let i = 0; i < messageCount; i++) {
    timestamps.push(formatMessageTime(baseTime, currentOffset))
    currentOffset += 0.5 + Math.random() * 1.5
  }

  return timestamps
}

// Determine which messages should have reactions
function getMessageReactions(messageCount: number): (('like' | 'love' | 'thanks') | null)[] {
  const reactions: (('like' | 'love' | 'thanks') | null)[] = new Array(messageCount).fill(null)
  // Add reaction to ~3 helpful agent messages
  const reactionTypes: ('like' | 'love' | 'thanks')[] = ['like', 'love', 'thanks']
  const reactionIndices = [3, 7, 11].filter(i => i < messageCount)
  reactionIndices.forEach((idx, i) => {
    reactions[idx] = reactionTypes[i % reactionTypes.length]
  })
  return reactions
}

// Animated chat component
function AnimatedChat() {
  const [currentSet, setCurrentSet] = useState(0)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const [lastAddedIndex, setLastAddedIndex] = useState(-1)
  const [timestamps, setTimestamps] = useState<string[]>([])
  const [reactions, setReactions] = useState<(('like' | 'love' | 'thanks') | null)[]>([])
  const [showResolved, setShowResolved] = useState(false)
  const [showRating, setShowRating] = useState(false)

  // Select conversation based on current hour
  useEffect(() => {
    const hour = new Date().getHours()
    const setIndex = hour % conversationSets.length
    setCurrentSet(setIndex)
    const msgCount = conversationSets[setIndex].messages.length
    setTimestamps(generateTimestamps(msgCount))
    setReactions(getMessageReactions(msgCount))
  }, [])

  const conversation = conversationSets[currentSet]

  // Animate messages appearing with realistic typing delays and pauses
  useEffect(() => {
    if (visibleMessages < conversation.messages.length) {
      const nextMsg = conversation.messages[visibleMessages]
      const typingDelay = getTypingDelay(nextMsg.text, nextMsg.from === 'customer')
      const readingPause = visibleMessages > 0 ? getReadingPause() : 500 // First message starts faster

      // First wait (reading/thinking pause), then show typing
      const pauseTimer = setTimeout(() => {
        setShowTyping(true)
      }, readingPause)

      // Then show the message after typing delay
      const messageTimer = setTimeout(() => {
        setShowTyping(false)
        setLastAddedIndex(visibleMessages)
        setVisibleMessages(prev => prev + 1)
      }, readingPause + typingDelay)

      return () => {
        clearTimeout(pauseTimer)
        clearTimeout(messageTimer)
      }
    } else if (visibleMessages === conversation.messages.length && !showResolved) {
      // Show resolved banner after last message
      const resolvedTimer = setTimeout(() => setShowResolved(true), 1500)
      return () => clearTimeout(resolvedTimer)
    } else if (showResolved && !showRating) {
      // Show rating after resolved
      const ratingTimer = setTimeout(() => setShowRating(true), 1200)
      return () => clearTimeout(ratingTimer)
    } else if (showRating) {
      // Reset and start over
      const resetTimer = setTimeout(() => {
        setVisibleMessages(0)
        setShowTyping(false)
        setLastAddedIndex(-1)
        setShowResolved(false)
        setShowRating(false)
        setTimestamps(generateTimestamps(conversation.messages.length))
        setReactions(getMessageReactions(conversation.messages.length))
      }, 5000)
      return () => clearTimeout(resetTimer)
    }
  }, [visibleMessages, conversation.messages.length, conversation.messages, showResolved, showRating])

  // Smooth scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [visibleMessages, showTyping, showResolved, showRating])

  const nextMessage = conversation.messages[visibleMessages]
  const isNextCustomer = nextMessage?.from === 'customer'
  const avatarInitial = conversation.customerName.split(' ').map(n => n[0]).join('')

  return (
    <div className="h-full flex flex-col bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <ChatHeader customerName={conversation.customerName} avatarInitial={avatarInitial} />

      {/* Messages Area */}
      <div
        ref={chatContainerRef}
        className="chat-container flex-1 flex flex-col gap-2.5 overflow-y-auto px-4 py-4 scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .chat-container::-webkit-scrollbar { display: none; }
          .chat-container { -webkit-overflow-scrolling: touch; }
        `}</style>

        {conversation.messages.slice(0, visibleMessages).map((msg, index) => (
          <ChatMessage
            key={`${currentSet}-${index}`}
            message={msg.text}
            isCustomer={msg.from === 'customer'}
            customerName={conversation.customerName}
            isNew={index === lastAddedIndex}
            timestamp={timestamps[index] || ''}
            showSeen={!msg.from.includes('customer') && index < visibleMessages - 1}
            reaction={reactions[index]}
          />
        ))}

        {showTyping && visibleMessages < conversation.messages.length && (
          <TypingIndicator
            isCustomer={isNextCustomer}
            customerName={conversation.customerName}
          />
        )}

        <ResolvedBanner show={showResolved} />
        <SatisfactionRating show={showRating} />

        <div ref={messagesEndRef} className="h-4 shrink-0" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithOAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(formData)
      router.push("/")
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: 'google' | 'microsoft') => {
    loginWithOAuth(provider)
  }

  return (
    <div className="flex min-h-screen">
      {/* Inject keyframes for animations */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Left side - Chat simulation */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Floating orbs background */}
        <FloatingOrbs />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Chat messages area with margins */}
        <div className="absolute inset-0 pt-48 pb-10 px-6 flex items-center justify-center">
          <div className="w-full max-w-md h-[75vh] max-h-[780px]">
            <AnimatedChat />
          </div>
        </div>

        {/* Top gradient overlay with branding */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-slate-950 via-slate-950/98 to-transparent z-10">
          <div className="flex flex-col items-center justify-center h-full px-8 pt-6">
            {/* Logo with rotating gradient border */}
            <div className="relative mb-5">
              {/* Aurora blobs - soft organic background glow */}
              <div
                className="absolute -inset-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.4), transparent 50%)',
                  animation: 'aurora-drift 8s ease-in-out infinite',
                  filter: 'blur(30px)',
                }}
              />
              <div
                className="absolute -inset-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.35), transparent 50%)',
                  animation: 'aurora-drift-2 10s ease-in-out infinite',
                  filter: 'blur(35px)',
                }}
              />
              <div
                className="absolute -inset-10 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2), transparent 60%)',
                  animation: 'soft-pulse 6s ease-in-out infinite',
                }}
              />

              {/* Rotating gradient border container */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden p-[2px]">
                {/* Spinning gradient border */}
                <div
                  className="absolute inset-[-50%] w-[200%] h-[200%]"
                  style={{
                    background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6)',
                    animation: 'border-spin 4s linear infinite',
                  }}
                />

                {/* Inner container with logo */}
                <div className="relative w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center z-10">
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-white/10 via-transparent to-white/5" />

                  {/* Logo */}
                  <Logo
                    variant="white"
                    size="lg"
                    className="relative z-10 scale-[1.6] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>

              {/* Soft glow underneath the border */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: '0 0 40px 8px rgba(139, 92, 246, 0.3), 0 0 80px 20px rgba(59, 130, 246, 0.2)',
                  animation: 'soft-pulse 4s ease-in-out infinite',
                }}
              />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Homa Customer Support
            </h1>
            <p className="text-sm text-white/50 text-center max-w-xs leading-relaxed">
              AI-powered conversations that delight
            </p>
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent z-10" />

        {/* Copyright */}
        <div className="absolute bottom-4 inset-x-0 text-center z-10">
          <p className="text-white/30 text-xs">© 2025 All Rights Reserved.</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-[58%] flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Logo variant="dark" size="lg" className="scale-150" />
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Good to see you
            </h2>
            <p className="text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <Button variant="link" className="px-0 text-xs text-muted-foreground hover:text-primary">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 pr-11 h-12"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs uppercase text-muted-foreground">Or continue with</span>
            <Separator className="flex-1" />
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={() => handleOAuthLogin('microsoft')}
              disabled={isLoading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Microsoft
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="px-1 text-primary">
              Contact us
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
