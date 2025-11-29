import React from 'react';
import { Check, X } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-12">
    <h2 className="text-3xl font-bold border-b-2 border-[var(--accent-blue)] pb-2 mb-6 text-white">{title}</h2>
    <div className="space-y-4 text-gray-300 leading-relaxed">{children}</div>
  </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-3 text-[var(--fitpro-accent)]">{title}</h3>
    <div className="space-y-2 text-gray-300 text-sm md:text-base">{children}</div>
  </div>
);

const ColorSwatch: React.FC<{ name: string; hex: string; }> = ({ name, hex }) => (
    <div className="flex flex-col">
        <div className="w-full h-24 rounded-lg border border-white/10" style={{ backgroundColor: hex }}></div>
        <div className="mt-2 text-center">
            <p className="font-bold text-white">{name}</p>
            <p className="text-xs text-gray-400 font-mono">{hex}</p>
        </div>
    </div>
);

const GradientSwatch: React.FC<{ name: string; gradient: string; colors: string }> = ({ name, gradient, colors }) => (
    <div className="flex flex-col">
        <div className="w-full h-24 rounded-lg" style={{ background: gradient }}></div>
        <div className="mt-2 text-center">
            <p className="font-bold text-white">{name}</p>
            <p className="text-xs text-gray-400 font-mono">{colors}</p>
        </div>
    </div>
);


const BrandGuide: React.FC = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-gray-200">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-white">Fit Pro</h1>
        <p className="text-2xl text-gray-400">Full Branding Kit</p>
      </header>
      
      {/* 1. Brand Identity */}
      <Section title="1. Brand Identity">
        <p>Fit Pro is a cutting-edge fitness-performance ecosystem designed for athletes who demand precision, data, and results. It's not just an app; it's a dedicated partner in the pursuit of peak performance.</p>
        <SubSection title="Personality & Core Values">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Scientific & Data-Driven:</strong> We believe in measurable progress. Every feature is rooted in sports science to provide actionable insights.</li>
            <li><strong>Energetic & Motivating:</strong> The UI, language, and feedback mechanisms are designed to inspire action and maintain high energy levels.</li>
            <li><strong>Trustworthy & Reliable:</strong> Athletes trust us with their most valuable data. We prioritize accuracy, security, and transparency.</li>
            <li><strong>Premium & Professional:</strong> Fit Pro delivers a high-end, polished experience, reflecting the serious commitment of our users.</li>
            <li><strong>Athletic-Tech Fusion:</strong> We merge the raw energy of sports with the precision of modern technology.</li>
          </ul>
        </SubSection>
        <SubSection title="Theme">
          <p className="font-bold text-lg tracking-wider">High Energy, Scientific, Trustworthy, Premium, Athletic-Tech.</p>
        </SubSection>
      </Section>
      
      {/* 2. Brand Symbol (Logo Concept) */}
      <Section title="2. Brand Symbol (Logo Concept)">
        <SubSection title="FP Lightning Badge">
            <p>The brand symbol is a geometric, minimal badge that ingeniously combines the letters 'F' and 'P'. Integrated within the negative space or as a core element is a sharp, stylized lightning bolt. This represents the fusion of Fitness (F) and Performance (P) with the core concepts of Energy and Power (lightning bolt).</p>
            <p className="mt-4"><strong>Key Meanings:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
                <li><strong>F + P:</strong> Fitness & Performance</li>
                <li><strong>Lightning Bolt:</strong> Energy, Power, Speed, Activation</li>
            </ul>
            <p className="mt-4"><strong>Usage:</strong></p>
            <p>The symbol is designed for versatility. It must be clear and recognizable as a mobile app icon, a favicon, a small icon on a dashboard, a watermark on images, and a standalone identity element on merchandise or social media.</p>
        </SubSection>
      </Section>

      {/* 3. Color Palette */}
      <Section title="3. Complete Color Palette">
        <SubSection title="Primary Colors">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ColorSwatch name="Energy Green" hex="#2B8A3E" />
            <ColorSwatch name="Bright Green" hex="#00C16F" />
            <ColorSwatch name="Dark Grey/Black" hex="#1F1F1F" />
            <ColorSwatch name="Pure White" hex="#FFFFFF" />
          </div>
        </SubSection>
        <SubSection title="Secondary Colors">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
            <ColorSwatch name="Graphite Gray" hex="#1F1F1F" />
            <ColorSwatch name="Steel Silver" hex="#D9D9D9" />
            <ColorSwatch name="Energy Yellow" hex="#FFE605" />
            <ColorSwatch name="Alert Red" hex="#FF375F" />
            <ColorSwatch name="Power Orange" hex="#FF7A00" />
          </div>
        </SubSection>
        <SubSection title="Official Gradients">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GradientSwatch name="Electric Gradient" gradient="linear-gradient(90deg, #2B8A3E, #00C16F)" colors="#2B8A3E → #00C16F" />
                <GradientSwatch name="Performance Heat Gradient" gradient="linear-gradient(90deg, #FF7A00, #FFE605)" colors="#FF7A00 → #FFE605" />
                <GradientSwatch name="Deep Power Gradient" gradient="linear-gradient(90deg, #0D0D0D, #2A2A2A)" colors="#0D0D0D → #2A2A2A" />
            </div>
            <p className="mt-4"><strong>Usage Instructions:</strong> Gradients should be used purposefully to highlight key actions, data visualizations, and moments of achievement.
                <ul className="list-disc pl-5 mt-2">
                    <li><strong>Electric Gradient:</strong> Reserved for primary call-to-action buttons, active states, and key progress indicators. It signifies energy and forward momentum.</li>
                    <li><strong>Performance Heat Gradient:</strong> Used for data charts representing high intensity, peak performance metrics (like max heart rate), or critical alerts.</li>
                    <li><strong>Deep Power Gradient:</strong> A subtle gradient for backgrounds of premium cards or sections to add depth without distracting from the content.</li>
                </ul>
            </p>
        </SubSection>
      </Section>

      {/* 4. Typography System */}
      <Section title="4. Typography System">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <SubSection title="English Typography">
                    <p><strong>Primary Font:</strong> Montserrat</p>
                    <p className="text-sm text-gray-400">Used for headers, titles, and key UI elements. It's bold, geometric, and energetic.</p>
                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                        <p className="text-3xl font-bold">Montserrat Bold (Header 1)</p>
                        <p className="text-xl font-semibold">Montserrat SemiBold (Header 2)</p>
                        <p className="text-lg font-medium">Montserrat Medium (Labels, Buttons)</p>
                        <p className="font-normal">Montserrat Regular (Sub-text)</p>
                    </div>
                    <p className="mt-4"><strong>Secondary Font:</strong> Inter</p>
                    <p className="text-sm text-gray-400">Used for body copy, descriptions, and paragraphs where readability is paramount.</p>
                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                         <p className="font-medium">Inter Medium (Lead Paragraphs)</p>
                         <p className="font-normal">Inter Regular (Body text, detailed descriptions, and other long-form content.)</p>
                    </div>
                </SubSection>
            </div>
            <div>
                <SubSection title="Persian Typography">
                    <p><strong>Primary Font:</strong> Vazirmatn</p>
                    <p className="text-sm text-gray-400">فونت اصلی برای تیترها، عناوین و المان‌های کلیدی رابط کاربری.</p>
                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                        <p className="text-3xl font-bold">وزیرمتن ضخیم (تیتر ۱)</p>
                        <p className="text-lg font-medium">وزیرمتن متوسط (لیبل‌ها، دکمه‌ها)</p>
                        <p className="font-normal">وزیرمتن معمولی (متن‌های فرعی)</p>
                    </div>
                     <p className="mt-4"><strong>Backup Font:</strong> Shabnam</p>
                    <p className="text-sm text-gray-400">فونت جایگزین برای متون بدنه و پاراگراف‌ها.</p>
                </SubSection>
            </div>
        </div>
        <SubSection title="Usage Rules">
            <ul className="list-disc pl-5">
                <li><strong>Headers (H1, H2):</strong> Vazirmatn Bold. High contrast, large font size.</li>
                <li><strong>Body Text:</strong> Vazirmatn Regular. Optimized for readability.</li>
                <li><strong>Labels & UI Elements:</strong> Vazirmatn Medium. Slightly heavier weight for clarity.</li>
                <li><strong>KPI Numbers:</strong> Vazirmatn Bold. Use a monospaced feature if available for alignment. Should be prominent and instantly readable.</li>
            </ul>
        </SubSection>
      </Section>
      
      {/* 5. Iconography Style */}
      <Section title="5. Iconography Style">
        <p>The custom icon set is inspired by the intersection of athletic performance and technology, embodying a modern, clean, and energetic aesthetic.</p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Line Thickness:</strong> Bold, consistent stroke weight (e.g., 2px) for clarity and impact.</li>
            <li><strong>Edges:</strong> Softly rounded corners and end-caps to feel modern and approachable, not sharp or aggressive.</li>
            <li><strong>Accent Highlights:</strong> A subtle use of Bright Green or other accents as a secondary color or glow effect on active or key icons.</li>
            <li><strong>Geometry:</strong> Based on simple geometric shapes (circles, squares, triangles) with a tech-inspired feel.</li>
            <li><strong>Visual Weight:</strong> All icons must have a consistent visual weight and footprint to ensure harmony in the UI.</li>
        </ul>
        <SubSection title="Examples">
            <p className="text-gray-400">dumbbell, muscle stats, DNA profile, hormone panel, recovery cycle, nutrition plate, heart rate, workout journal.</p>
        </SubSection>
      </Section>

      {/* 6. Component Style Guide */}
      <Section title="6. Component Style Guide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-white mb-2">Cards</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Dark graphite background (#1F1F1F).</li>
                    <li>Generous 20px rounded corners.</li>
                    <li>Subtle 1px border in a slightly lighter gray.</li>
                    <li>Soft glow edges on hover.</li>
                    <li>Hover state includes a slight upward transform and gradient animation on the border.</li>
                </ul>
            </div>
             <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-white mb-2">Buttons</h4>
                 <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong>Primary:</strong> Full Electric gradient background with a subtle glow effect. Text is white and bold.</li>
                    <li><strong>Secondary:</strong> Black background with a 1px bright green border. Text is Bright Green.</li>
                    <li>Hover states increase glow/brightness.</li>
                    <li>Disabled state has 50% opacity.</li>
                </ul>
            </div>
             <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-white mb-2">Charts</h4>
                 <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Dark background for high contrast.</li>
                    <li>Primary data lines are Bright green.</li>
                    <li>Markers and tooltips use Blue accent.</li>
                    <li>Grid lines are a faint Graphite Gray.</li>
                    <li>Interactive elements feature a soft pulse animation to draw attention.</li>
                </ul>
            </div>
        </div>
         <SubSection title="Layout Rules">
            <ul className="list-disc pl-5">
                <li><strong>High Whitespace:</strong> Use ample space to reduce cognitive load and create a premium, focused feel.</li>
                <li><strong>Modern Grid:</strong> Adhere to a consistent grid system for spacing and alignment.</li>
                <li><strong>Smooth Animations:</strong> Employ physics-based animations (e.g., 0.3s ease-out) for all state changes.</li>
                <li><strong>Balanced Shadows:</strong> Use soft, subtle shadows to create depth, avoiding harsh, pure-black shadows.</li>
                <li><strong>Athletic-tech Feel:</strong> The layout must feel structured, modern, and aligned with the overall theme.</li>
            </ul>
        </SubSection>
      </Section>

      {/* 7. Brand Voice & Messaging */}
      <Section title="7. Brand Voice & Messaging">
        <p>The brand voice is confident, knowledgeable, and motivational. It speaks to the user as a trusted coach or sports scientist. The tone is direct, clear, and action-oriented, avoiding jargon where possible but using scientific terms correctly when necessary.</p>
        <p><strong>Core principles:</strong> performance, energy, trust, science, motivation.</p>
        <SubSection title="Sample Taglines">
            <div className="italic text-lg space-y-2 text-center text-[var(--fitpro-accent)]">
                <p>"Train Smarter. Track Deeper. Perform Better."</p>
                <p>"Your Power Starts Here."</p>
                <p>"Unlock Your Peak Performance."</p>
                <p>"Data-Driven. Athlete-Proven."</p>
            </div>
        </SubSection>
      </Section>
      
      {/* 8. Brand Usage Rules */}
      <Section title="8. Brand Usage Rules">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/50">
                <h4 className="font-bold text-green-400 mb-3 flex items-center"><Check className="mr-2"/> Allowed (Dos)</h4>
                <ul className="list-disc pl-5 text-sm space-y-2">
                    <li>Use the primary color palette for 90% of the UI.</li>
                    <li>Apply gradients to primary interactive elements.</li>
                    <li>Maintain high contrast for text readability (WCAG AA).</li>
                    <li>Use the FP Badge with sufficient clear space around it.</li>
                    <li>Adhere to the defined typography hierarchy.</li>
                </ul>
            </div>
            <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
                <h4 className="font-bold text-red-400 mb-3 flex items-center"><X className="mr-2"/> Prohibited (Don'ts)</h4>
                <ul className="list-disc pl-5 text-sm space-y-2">
                    <li>Do not stretch, distort, or change the color of the FP Badge.</li>
                    <li>Do not use more than two gradients on a single screen.</li>
                    <li>Avoid using secondary colors for primary actions.</li>
                    <li>Do not use primary font for long paragraphs of body text.</li>
                    <li>Do not create cluttered layouts with insufficient whitespace.</li>
                </ul>
            </div>
        </div>
      </Section>

      {/* 9. Brand Application Examples */}
      <Section title="9. Full Brand Application Examples">
        <SubSection title="Dashboard">
          <p>The main dashboard uses Deep Black and Graphite Gray cards with bright green and blue highlights for charts and KPIs. The focus is on instant data readability. The "Electric Gradient" is used on the "Log Today's Workout" button.</p>
        </SubSection>
        <SubSection title="Homepage">
          <p>The public-facing homepage uses bold, full-screen imagery of athletes, overlaid with the Vazirmatn Bold headline font. The primary call-to-action ("Get Started") prominently features the Electric Gradient.</p>
        </SubSection>
         <SubSection title="Onboarding Screens">
          <p>Clean, focused screens with a single action per screen. Deep Power Gradient background with illustrations using the brand's iconography style guides new users through setup.</p>
        </SubSection>
         <SubSection title="KPI Panels">
          <p>Large, clear numbers in Vazirmatn Bold. Performance Heat Gradient is used in the background of charts showing personal bests or critical metrics.</p>
        </SubSection>
        <SubSection title="Nutrition & Workout Modules">
            <p>Modules maintain the dark theme. Interactive elements like adding an exercise or completing a meal use primary accent colors. Progress bars utilize the Electric Gradient.</p>
        </SubSection>
        <SubSection title="Notification Bar (Ticker Strip)">
            <p>A scrolling ticker uses Bright Green for positive updates (e.g., "New Personal Best!") and Energy Yellow for neutral information, set against a Deep Black background.</p>
        </SubSection>
        <SubSection title="Trainer–trainee System">
          <p>Messaging and feedback sections use a clean, structured layout. Trainer comments are highlighted with a blue accent, while AI suggestions are marked with a green accent.</p>
        </SubSection>
        <SubSection title="Mobile View">
            <p>The brand translates to mobile with a focus on touch-friendly targets. The FP Badge is the app icon. The core navigation uses the custom icon set, with the active tab highlighted in an accent color.</p>
        </SubSection>
      </Section>
    </div>
  );
};

export default BrandGuide;