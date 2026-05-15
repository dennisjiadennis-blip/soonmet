/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Car,
  CarFront,
  Globe2,
  Handshake,
  Languages,
  Mail,
  MapPinned,
  MessageCircle,
  MoonStar,
  PenTool,
  Route,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Users,
} from "lucide-react";

const highlights = [
  "The world's first vertical AI agent for travel",
  "Connects XChat, LINE, Telegram, and more",
  "Private relay, translation, matching, and booking help",
  "Built to connect real travelers with real people",
];

const serviceCards = [
  {
    title: "Find a travel buddy",
    description: "Meet someone aligned with your timing, vibe, and travel pace before the night even begins.",
    icon: Users,
  },
  {
    title: "Meet a local for drinks and conversation",
    description: "Step into a softer, more human night out with someone who knows the room, not just the address.",
    icon: MoonStar,
  },
  {
    title: "Book restaurants and everyday services",
    description: "Let AskALocal relay the details, bridge the language, and help secure everyday reservations with ease.",
    icon: UtensilsCrossed,
  },
  {
    title: "Book massage services",
    description: "Arrange restorative experiences with less friction, clearer communication, and more confidence.",
    icon: Sparkles,
  },
  {
    title: "Arrange private cars and drivers",
    description: "Move through unfamiliar cities with reliable, verified transport support and booking coordination.",
    icon: CarFront,
  },
  {
    title: "Rent a car and explore freely",
    description: "Plan a self-driven day with local guidance, practical tips, and help navigating the unknowns.",
    icon: Car,
  },
  {
    title: "Connect with a local for cultural exchange",
    description: "Turn a trip into a conversation by meeting people who open doors into language, customs, and daily life.",
    icon: Languages,
  },
  {
    title: "Step into the studio of a local artisan or artist",
    description: "Go beyond sightseeing and enter spaces where craft, history, and personal stories still live.",
    icon: PenTool,
  },
  {
    title: "Muslim-friendly travel packages in Japan",
    description: "Travel with greater peace of mind through curated support around food, prayer, comfort, and logistics.",
    icon: ShieldCheck,
  },
];

const trustPoints = [
  "AskALocal only charges the membership fee.",
  "No commission is added to restaurant, massage, rental, private car, driver, or booking costs.",
  "Actual service costs go directly to third-party providers.",
  "AskALocal handles connection, relay, translation, matching, and booking assistance.",
];

const qrEntryChannels = [
  {
    name: "Join from XChat",
    sublabel: "Recommended channel",
    accent: "border-cyan-300/40 bg-cyan-300/12 text-cyan-50",
  },
  {
    name: "Join from LINE",
    sublabel: "Supported channel",
    accent: "border-white/10 bg-white/6 text-white/82",
  },
  {
    name: "Join from Telegram",
    sublabel: "Supported channel",
    accent: "border-white/10 bg-white/6 text-white/82",
  },
];

function FakeQrPlaceholder() {
  const cells = [
    1, 1, 1, 1, 0, 1, 0, 1,
    1, 0, 0, 1, 1, 0, 1, 0,
    1, 0, 1, 0, 1, 1, 0, 1,
    1, 1, 0, 1, 0, 1, 1, 0,
    0, 1, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 0, 1, 0, 1,
    0, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 0, 0, 1, 1, 0, 1,
  ];

  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white p-3 shadow-inner">
      <div className="grid grid-cols-8 gap-1">
        {cells.map((cell, index) => (
          <div
            key={`${cell}-${index}`}
            className={`aspect-square rounded-[2px] ${cell ? "bg-[#0b1320]" : "bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}

function NetworkVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_30%),linear-gradient(135deg,rgba(8,15,30,0.96),rgba(8,16,24,0.82))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,191,36,0.12),transparent_18%),radial-gradient(circle_at_20%_80%,rgba(56,189,248,0.16),transparent_24%)]" />
      <div className="relative flex items-center justify-between text-xs text-white/60">
        <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1">XChat</div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">LINE</div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Telegram</div>
      </div>

      <div className="relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Traveler</div>
          <div className="text-lg font-semibold text-white">"Can you help me find a local tonight?"</div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <MessageCircle className="h-4 w-4 text-cyan-300" />
            Sent from X / XChat
          </div>
        </div>

        <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
          <div className="absolute h-44 w-44 rounded-full border border-white/8" />
          <div className="absolute h-56 w-56 rounded-full border border-white/6" />
          <Bot className="h-10 w-10 text-cyan-200" />
        </div>

        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Local Network</div>
          <div className="text-lg font-semibold text-white">Matched, translated, relayed, and confirmed.</div>
          <div className="grid gap-2 text-sm text-white/65">
            <div className="rounded-2xl bg-white/5 px-3 py-2">Local friend</div>
            <div className="rounded-2xl bg-white/5 px-3 py-2">Restaurant host</div>
            <div className="rounded-2xl bg-white/5 px-3 py-2">Driver or service provider</div>
          </div>
        </div>
      </div>

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 640"
        fill="none"
        aria-hidden="true"
      >
        <path d="M180 218C282 236 328 282 425 318" stroke="rgba(103,232,249,0.55)" strokeWidth="2" strokeDasharray="8 10" />
        <path d="M572 316C666 276 728 240 838 218" stroke="rgba(251,191,36,0.45)" strokeWidth="2" strokeDasharray="8 10" />
        <path d="M180 428C284 398 354 366 432 326" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="8 10" />
        <path d="M575 323C648 364 740 408 840 428" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="8 10" />
      </svg>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        {[
          "Cross-platform private relay",
          "AI translation in the loop",
          "Human connection, not just answers",
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#06101d] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(18,110,130,0.26),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(245,158,11,0.12),transparent_18%),linear-gradient(180deg,#07111c_0%,#07111c_42%,#091625_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <section className="grid gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-18">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100/80">
              <Sparkles className="h-3.5 w-3.5" />
              AskALocal
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-orange-500 sm:text-5xl lg:text-6xl">
              The world's first vertical AI agent for travel.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
              AskALocal works through XChat, LINE, Telegram, and more, so travelers, locals,
              and service providers can connect without downloading another app. Private relay,
              translation, and cross-platform coordination happen inside the chat apps people
              already use.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-cyan-100"
              >
                Try on X / XChat
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="#local-pass"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              >
                Explore Local Pass
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/72 backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <NetworkVisual />
        </section>

        <section id="x-entry" className="py-8 lg:py-12">
          <div className="overflow-hidden rounded-[2.25rem] border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(0,0,0,0.08)),radial-gradient(circle_at_top_right,rgba(34,211,238,0.25),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.18),transparent_24%),linear-gradient(140deg,#0a1626,#0b1320)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.4)] sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100/80">
                  <Route className="h-3.5 w-3.5" />
                  Cross-Platform Access
                </div>
                <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-emerald-300 sm:text-4xl">
                  No extra app. No platform barrier.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                  AskALocal connects XChat, LINE, Telegram, and more, so travelers, locals,
                  and service providers can privately communicate across platforms using the
                  chat app they already have. The AI agent helps relay messages, translate when
                  needed, and connect people even when they are on different chat platforms.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Private relay</div>
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Cross-platform messaging</div>
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">AI translation</div>
                  <div className="rounded-full border border-white/12 bg-white/6 px-4 py-2">Human matching</div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5 backdrop-blur">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/45">
                  <span>Scan To Enter</span>
                  <span>Chat Channels</span>
                </div>
                <div className="mt-6 grid gap-4">
                  {qrEntryChannels.map((channel) => (
                    <div
                      key={channel.name}
                      className={`grid grid-cols-[1fr_96px] items-center gap-4 rounded-[1.5rem] border px-4 py-4 ${channel.accent}`}
                    >
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                          {channel.sublabel}
                        </div>
                        <div className="mt-2 text-base font-medium">{channel.name}</div>
                        <div className="mt-1 text-sm text-white/65">
                          Placeholder QR for now
                        </div>
                      </div>
                      <FakeQrPlaceholder />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/6 px-4 py-4 text-white/78">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                    Supplier Access
                  </div>
                  <div className="mt-2 text-base font-medium">
                    We are local suppliers. We want to join.
                  </div>
                  <a
                    href="mailto:tatamilabs@outlook.com"
                    className="mt-3 inline-flex items-center gap-2 text-sm text-cyan-200 transition hover:text-cyan-100"
                  >
                    <Mail className="h-4 w-4" />
                    tatamilabs@outlook.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mb-8 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Experience Visuals</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-emerald-300 sm:text-4xl">
              Travel is better when it feels like entering real life.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/68">
              AskALocal is built for the moments between planning and memory: the warm table,
              the trusted introduction, the studio door that opens, the quiet help when a city
              still feels unfamiliar.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
              <img
                src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80"
                alt="Travelers enjoying a warm city-night atmosphere with locals"
                className="h-full min-h-[420px] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="text-xs uppercase tracking-[0.24em] text-amber-200/80">Nightlife Connection</div>
                <h3 className="mt-3 text-2xl font-semibold text-white">Find the kind of night that starts with a conversation.</h3>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/72">
                  From drinks with locals to spontaneous introductions, the city feels less like a map
                  and more like an invitation.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
                  alt="Travelers meeting in a creative cultural space"
                  className="h-full min-h-[200px] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Cultural Exchange</div>
                  <p className="mt-2 max-w-sm text-lg font-medium text-white">
                    Meet people who turn a destination into a real conversation.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/20">
                <img
                  src="https://images.unsplash.com/photo-1518527989017-5baca7a58d3c?auto=format&fit=crop&w=1200&q=80"
                  alt="A local artisan workspace"
                  className="h-full min-h-[200px] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">Studios And Craft</div>
                  <p className="mt-2 max-w-sm text-lg font-medium text-white">
                    Step into spaces where local culture is still being made by hand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Services</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-emerald-300 sm:text-4xl">
                From nightlife to bookings to cultural exchange.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/64">
              Each card is an experience layer. AskALocal relays, translates, coordinates,
              and helps people connect in ways that feel natural on the ground.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map((service) => (
              <div
                key={service.title}
                className="group rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-100">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-medium text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/66">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="local-pass" className="py-12 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-cyan-100/80">
                <BadgeCheck className="h-3.5 w-3.5" />
                Local Pass
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-emerald-300 sm:text-4xl">
                One pass. Lifetime access.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/70">
                Local Pass is the membership layer behind AskALocal. One purchase gives you
                long-term access to the core travel infrastructure: AI help, private relay,
                translation, matching, connection support, and booking assistance.
              </p>
              <div className="mt-6 grid gap-3 text-sm text-white/70">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Globe2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                  Use the same access layer across nightlife, services, and local introductions.
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Languages className="mt-0.5 h-4 w-4 text-cyan-200" />
                  Keep translation and message relay in the loop when communication gets difficult.
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Handshake className="mt-0.5 h-4 w-4 text-cyan-200" />
                  Stay connected to verified local humans instead of navigating alone.
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(145deg,#111827,#0f1724)] p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-amber-100/70">Early-Bird Offer</div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Premium access, priced for first movers.</h3>
                </div>
                <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium text-amber-100">
                  Limited time
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-end gap-4">
                <div className="text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">USD 3.5</div>
                <div className="pb-2 text-lg text-white/40 line-through">USD 35</div>
              </div>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                Local Pass is normally USD 35. The current early-bird price is USD 3.5.
                This limited-time early-bird offer may end at any time.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Lifetime membership access",
                  "AI assistance and routing support",
                  "Translation and relay included",
                  "Matching and booking help included",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/75">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-amber-100"
                >
                  Get Local Pass via X
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="#trust"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                >
                  See trust system
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="trust" className="py-12 lg:py-16">
          <div className="mb-8 max-w-2xl">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Trust And Verification</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-emerald-300 sm:text-4xl">
              A trust system that feels modern, clear, and human.
            </h2>
            <p className="mt-4 text-base leading-7 text-white/68">
              AskALocal is not the merchant for restaurants, rentals, private cars, drivers,
              or massage providers. It is the connection layer around them, with manual supplier
              verification designed to make travel support feel more reliable.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_0.88fr]">
            <div className="grid gap-4 md:grid-cols-2">
              {trustPoints.map((item) => (
                <div key={item} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-100">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/72">{item}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-cyan-100/80">
                <MapPinned className="h-3.5 w-3.5" />
                Manual Supplier Verification
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white">Verified by people, not just paperwork upload.</h3>
              <p className="mt-4 text-sm leading-6 text-white/68">
                All suppliers are manually verified. Verification includes business license,
                insurance, and relevant professional qualifications before they are presented
                inside the AskALocal network.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Business license review",
                  "Insurance confirmation",
                  "Professional qualification check",
                  "Ongoing quality screening",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/75">
                    <BadgeCheck className="h-4 w-4 text-cyan-200" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-18">
          <div className="overflow-hidden rounded-[2.2rem] border border-cyan-300/18 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.14),transparent_22%),linear-gradient(145deg,#0d1726,#0a1019)] px-8 py-10 sm:px-10 lg:px-12">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.24em] text-cyan-100/75">Final CTA</div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-emerald-300 sm:text-4xl">
                Who do you want to connect with this time?
              </h2>
              <p className="mt-4 text-base leading-7 text-white/70">
                Start your trip with real people. Enter AskALocal through X / XChat and let the
                agent carry the thread across platforms, places, and conversations.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-cyan-100"
              >
                Enter AskALocal through X / XChat
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="#x-entry"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              >
                Revisit the entry flow
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
