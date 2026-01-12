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

// Fake conversation data - changes based on hour
const conversationSets = [
  // Set 0 - E-commerce order issue
  {
    customerName: "Sarah Johnson",
    messages: [
      { from: "customer", text: "Hi, I placed an order yesterday but haven't received any confirmation email" },
      { from: "agent", text: "Hello Sarah! I'd be happy to help you with that. Could you please provide me with your order number or the email address you used?" },
      { from: "customer", text: "Sure, my email is sarah.j@email.com" },
      { from: "agent", text: "Thank you! I found your order #ORD-2024-8847. It looks like the confirmation was sent but may have gone to your spam folder." },
      { from: "customer", text: "Oh let me check... you're right! Found it in spam" },
      { from: "agent", text: "Great! I've also resent the confirmation to your inbox. Your order is being processed and should ship within 24 hours." },
      { from: "customer", text: "Perfect, thank you! How can I track the shipment?" },
      { from: "agent", text: "Once shipped, you'll receive a tracking link via email. You can also track it in your account under 'My Orders'" },
      { from: "customer", text: "That's very helpful. One more question - can I change the delivery address?" },
      { from: "agent", text: "Yes, since your order hasn't shipped yet, I can update the address for you. What's the new address?" },
      { from: "customer", text: "123 Oak Street, Apt 4B, New York, NY 10001" },
      { from: "agent", text: "I've updated your delivery address. You'll receive a confirmation email shortly with the updated details." },
      { from: "customer", text: "You've been so helpful! Thank you" },
      { from: "agent", text: "You're welcome, Sarah! Is there anything else I can help you with today?" },
      { from: "customer", text: "No, that's all. Have a great day!" },
      { from: "agent", text: "Thank you! Have a wonderful day too. Don't hesitate to reach out if you need anything else!" },
      { from: "customer", text: "Will do, bye!" },
      { from: "agent", text: "Goodbye! Take care! " },
    ]
  },
  // Set 1 - Technical support
  {
    customerName: "Michael Chen",
    messages: [
      { from: "customer", text: "Hello, I'm having trouble logging into my account" },
      { from: "agent", text: "Hi Michael! I'm sorry to hear that. What error message are you seeing when you try to log in?" },
      { from: "customer", text: "It says 'Invalid credentials' but I'm sure my password is correct" },
      { from: "agent", text: "I understand how frustrating that can be. Let me check your account status. Could you confirm the email address associated with your account?" },
      { from: "customer", text: "It's mchen.work@gmail.com" },
      { from: "agent", text: "Thank you. I can see your account is active. It appears your password was reset 3 days ago. Did you initiate this change?" },
      { from: "customer", text: "No, I didn't! Is my account compromised?" },
      { from: "agent", text: "Don't worry, I'll help secure your account right away. I'm sending a secure password reset link to your email now." },
      { from: "customer", text: "Got it! Should I change it right away?" },
      { from: "agent", text: "Yes, please reset your password immediately. Also, I recommend enabling two-factor authentication for extra security." },
      { from: "customer", text: "Good idea. How do I enable 2FA?" },
      { from: "agent", text: "After logging in, go to Settings > Security > Two-Factor Authentication. You can use an authenticator app or SMS verification." },
      { from: "customer", text: "Just set it up with Google Authenticator. Thanks!" },
      { from: "agent", text: "Excellent! Your account is now much more secure. I've also logged out all other sessions as a precaution." },
      { from: "customer", text: "That's reassuring. Should I check anything else?" },
      { from: "agent", text: "I'd recommend reviewing your recent account activity under Settings > Activity Log to ensure nothing looks suspicious." },
      { from: "customer", text: "Everything looks normal there. Thank you for the quick help!" },
      { from: "agent", text: "You're welcome, Michael! Stay safe online. Feel free to reach out if you have any other concerns!" },
    ]
  },
  // Set 2 - Billing inquiry
  {
    customerName: "Emma Williams",
    messages: [
      { from: "customer", text: "Hi, I noticed a double charge on my credit card statement" },
      { from: "agent", text: "Hello Emma! I apologize for the inconvenience. Let me look into this for you right away. When did you notice the duplicate charge?" },
      { from: "customer", text: "Today, when I checked my bank app. Both charges are from yesterday" },
      { from: "agent", text: "I see. Could you provide the last 4 digits of the card used and the approximate amount?" },
      { from: "customer", text: "Card ending in 4521, and the amount is $89.99 each" },
      { from: "agent", text: "Thank you. I found the issue - there was a system glitch during checkout that caused a duplicate transaction. I'm initiating a refund now." },
      { from: "customer", text: "Oh good! How long will the refund take?" },
      { from: "agent", text: "The refund will be processed within 3-5 business days. You'll receive a confirmation email within the hour." },
      { from: "customer", text: "That's a relief. This hasn't happened before" },
      { from: "agent", text: "You're right, and I sincerely apologize. We've identified the bug and our team is deploying a fix today." },
      { from: "customer", text: "Good to know you're on top of it" },
      { from: "agent", text: "As a gesture of goodwill, I've also added a $10 credit to your account for your next purchase." },
      { from: "customer", text: "Oh wow, that's very kind! Thank you" },
      { from: "agent", text: "It's the least we can do. Is there anything else I can help you with today?" },
      { from: "customer", text: "Actually yes, can you email me a receipt for the refund?" },
      { from: "agent", text: "Absolutely! I'll send both the refund confirmation and an updated receipt to your email right now." },
      { from: "customer", text: "Perfect. You've been wonderful, thank you!" },
      { from: "agent", text: "Thank you for your patience, Emma! Have a great rest of your day!" },
    ]
  },
  // Set 3 - Product inquiry
  {
    customerName: "David Park",
    messages: [
      { from: "customer", text: "Hey, I'm interested in the Pro subscription. What's included?" },
      { from: "agent", text: "Hi David! Great question! The Pro plan includes unlimited projects, priority support, advanced analytics, and team collaboration features." },
      { from: "customer", text: "How many team members can I add?" },
      { from: "agent", text: "With Pro, you can add up to 10 team members. If you need more, our Enterprise plan offers unlimited seats." },
      { from: "customer", text: "10 should be enough for now. What about storage?" },
      { from: "agent", text: "Pro includes 100GB of cloud storage. You can also integrate with your existing cloud providers like Google Drive or Dropbox." },
      { from: "customer", text: "Nice! Is there a trial period?" },
      { from: "agent", text: "Yes! We offer a 14-day free trial with full access to all Pro features. No credit card required to start." },
      { from: "customer", text: "That's great. Can I cancel anytime?" },
      { from: "agent", text: "Absolutely. You can cancel anytime with no penalties. If you cancel, you'll retain access until the end of your billing period." },
      { from: "customer", text: "What about data export if I decide to leave?" },
      { from: "agent", text: "We make it easy to export all your data in standard formats like CSV, JSON, or PDF. Your data is always yours." },
      { from: "customer", text: "I appreciate the transparency. Do you offer annual billing?" },
      { from: "agent", text: "Yes! Annual billing saves you 20% compared to monthly. That's $19/month instead of $24/month." },
      { from: "customer", text: "I think I'll start the trial and then go annual" },
      { from: "agent", text: "Excellent choice! I can set up your trial right now. Would you like me to send you a link?" },
      { from: "customer", text: "Yes please!" },
      { from: "agent", text: "Done! Check your email for the trial activation link. Welcome aboard, David! " },
    ]
  },
  // Set 4 - Shipping issue
  {
    customerName: "Lisa Thompson",
    messages: [
      { from: "customer", text: "My package says delivered but I never received it" },
      { from: "agent", text: "Hi Lisa! I'm sorry to hear that. Let me help you locate your package. Could you share your order number?" },
      { from: "customer", text: "It's ORDER-29845" },
      { from: "agent", text: "Thank you. I can see it was marked as delivered yesterday at 2:34 PM. Was anyone else home who might have received it?" },
      { from: "customer", text: "I live alone and I was at work. Could it be with a neighbor?" },
      { from: "agent", text: "That's possible. I can also see the delivery photo - it shows the package at a door with a blue welcome mat. Does that match your entrance?" },
      { from: "customer", text: "No, my mat is red. That must be someone else's door!" },
      { from: "agent", text: "I see - it looks like there was a delivery error. I'm filing a claim with the carrier right now and will send you a replacement immediately." },
      { from: "customer", text: "That would be amazing. How soon can I get it?" },
      { from: "agent", text: "I'm upgrading you to express shipping at no cost. You should receive it within 1-2 business days." },
      { from: "customer", text: "Thank you! Should I do anything about the misdelivered package?" },
      { from: "agent", text: "No need - we'll handle that with the carrier. If by chance the original shows up, just let us know and we can arrange a return label." },
      { from: "customer", text: "That's very fair. I really appreciate the quick resolution" },
      { from: "agent", text: "Of course! I've also added a 15% discount code for your next order as an apology for the inconvenience." },
      { from: "customer", text: "You didn't have to do that but thank you!" },
      { from: "agent", text: "We value your loyalty, Lisa. The code is SORRY15 and it's valid for 30 days." },
      { from: "customer", text: "I'll definitely use it. Thanks again!" },
      { from: "agent", text: "You're welcome! I'll send you tracking info shortly. Have a wonderful day!" },
    ]
  },
  // Set 5 - Account upgrade
  {
    customerName: "James Rodriguez",
    messages: [
      { from: "customer", text: "Hi, I want to upgrade my account to business tier" },
      { from: "agent", text: "Hello James! That's great news! I'd be happy to help you upgrade. Are you currently on our Starter or Pro plan?" },
      { from: "customer", text: "I'm on Pro but my team is growing fast" },
      { from: "agent", text: "Congratulations on the growth! Business tier is perfect for scaling teams. It includes unlimited users, advanced permissions, and dedicated support." },
      { from: "customer", text: "What about our existing data and settings?" },
      { from: "agent", text: "Everything transfers seamlessly - all your projects, users, and configurations will remain intact during the upgrade." },
      { from: "customer", text: "Good. What's the pricing difference?" },
      { from: "agent", text: "Business is $49/month per user with annual billing, compared to $24/month for Pro. However, you get volume discounts for teams over 20 users." },
      { from: "customer", text: "We're at 35 users right now" },
      { from: "agent", text: "Perfect! At 35 users, you'd qualify for our 15% volume discount, bringing it to $41.65 per user per month." },
      { from: "customer", text: "That's reasonable. What about implementation support?" },
      { from: "agent", text: "Business tier includes a dedicated account manager and 4 hours of onboarding support to help your team transition smoothly." },
      { from: "customer", text: "Do you offer custom training for our specific workflows?" },
      { from: "agent", text: "Absolutely! We can schedule custom training sessions for your team. Most customers find 2-3 sessions sufficient." },
      { from: "customer", text: "Let's do it. Can we start the upgrade today?" },
      { from: "agent", text: "Yes! I'll send you the upgrade agreement now. Once signed, your account will be upgraded within the hour." },
      { from: "customer", text: "Sending it back now. Excited to get started!" },
      { from: "agent", text: "Received! Welcome to Business tier, James! Your account manager Sarah will reach out tomorrow to schedule onboarding." },
    ]
  },
  // Set 6 - Feature request
  {
    customerName: "Amanda Foster",
    messages: [
      { from: "customer", text: "Is there a way to export reports as PDF?" },
      { from: "agent", text: "Hi Amanda! Currently, reports can be exported as CSV or Excel. May I ask what you'd use the PDF format for?" },
      { from: "customer", text: "I need to share monthly reports with stakeholders who don't use spreadsheets" },
      { from: "agent", text: "That makes total sense! While we don't have native PDF export yet, I have a workaround that might help in the meantime." },
      { from: "customer", text: "I'm all ears!" },
      { from: "agent", text: "You can use the 'Print Report' option and select 'Save as PDF' from your browser's print dialog. It maintains all the formatting." },
      { from: "customer", text: "Oh that's clever! I'll try that" },
      { from: "agent", text: "Also, I want to let you know that PDF export is actually on our roadmap for Q2 this year!" },
      { from: "customer", text: "Really? That's great to hear!" },
      { from: "agent", text: "Yes! I've also added your use case to the feature request. Customer feedback like yours helps prioritize development." },
      { from: "customer", text: "Happy to help. Will I be notified when it launches?" },
      { from: "agent", text: "I've added you to the early access list. You'll be among the first to try it and provide feedback." },
      { from: "customer", text: "Perfect! Any other features coming soon I should know about?" },
      { from: "agent", text: "We're launching scheduled reports next month - you'll be able to auto-send reports to stakeholders on a schedule." },
      { from: "customer", text: "That would save me so much time! Sign me up for that too" },
      { from: "agent", text: "Done! You're on the beta list. I'll send you an email when it's ready to test." },
      { from: "customer", text: "You've been super helpful. Thanks!" },
      { from: "agent", text: "My pleasure, Amanda! Feel free to reach out anytime with more feedback or questions!" },
    ]
  },
  // Set 7 - Refund request
  {
    customerName: "Robert Kim",
    messages: [
      { from: "customer", text: "I need to request a refund for my subscription" },
      { from: "agent", text: "Hi Robert, I'm sorry to hear you want to cancel. Before I process the refund, may I ask what's prompting this decision?" },
      { from: "customer", text: "The software is great but my project got cancelled so I don't need it anymore" },
      { from: "agent", text: "I understand - these things happen. I can certainly process that refund for you. You have 18 days left on your current billing period." },
      { from: "customer", text: "Can I get a refund for the unused portion?" },
      { from: "agent", text: "Yes! Since you're within our 30-day policy, I can refund the prorated amount of $42.50 for the remaining days." },
      { from: "customer", text: "That's fair. Please proceed" },
      { from: "agent", text: "Processing now... Done! The refund will appear on your card within 5-7 business days." },
      { from: "customer", text: "Thanks. If my situation changes, can I resubscribe easily?" },
      { from: "agent", text: "Absolutely! Your account and all your data will be preserved for 90 days. Just log in and reactivate whenever you're ready." },
      { from: "customer", text: "That's great to know. I might be back sooner than expected" },
      { from: "agent", text: "We'll be here! Also, I want you to know we offer a 50% discount for returning customers within 6 months." },
      { from: "customer", text: "Wow, that's generous. I'll keep that in mind" },
      { from: "agent", text: "Just mention code WELCOME50 when you return. Is there anything else I can help with?" },
      { from: "customer", text: "No, you've been great. Best customer service I've experienced" },
      { from: "agent", text: "Thank you so much, Robert! That means a lot. Best of luck with your future projects!" },
      { from: "customer", text: "Thanks! Take care" },
      { from: "agent", text: "You too! Don't hesitate to reach out if you need anything. Goodbye!" },
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
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-violet-500/50 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Logo variant="white" size="lg" className="scale-150" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Homa Dashboard
            </h1>
            <p className="text-sm text-white/50 text-center max-w-xs leading-relaxed">
              AI-powered customer support that delights
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
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Sign in to your account to continue
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
