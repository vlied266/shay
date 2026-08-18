import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'

const RECONSTRUCTION_PROMPT = `# SHAY KAY STUDIO - Reconstruction Prompt

## Brand Brief

**Brand Name:** Shay Kay Studio
**Positioning:** Premium creative director and visual designer working across luxury, beauty, health, real estate, and lifestyle
**Visual Language:** Minimal, luxurious, editorial, natural, confident, modern, cinematic
**Core Message:** "One creative vision, shaped across different industries"

## Hero Video

**Filename:** hero.mp4
**Path:** /media/hero.mp4
**Narrative:**
- Opens with extreme close-up of a human eye with distant world reflected on surface
- Camera moves into reflection, seamlessly becoming full-screen environment
- Female figure walks continuously while visual world evolves around her
- Transformation sequence:
  1. Refined matte sculptural avatar (Visual Design concept)
  2. Photorealistic human with natural skin/hair (Beauty & Skincare)
  3. Subtle body-connected graphics (Health & Medical)
  4. Architectural elements and premium contemporary home (Real Estate)
  5. Premium lifestyle outfit with warm, lived-in environment (Lifestyle)
- Sequence ends in wide architectural frame with generous negative space
- Continuous walk, no cuts, natural transitions

## Visual System

**Color Palette:**
- Primary: #1a1a1a (deep black)
- Accent Gold: #d4af37 (warm, luxury gold)
- Secondary Grey: #8b8b8b (warm grey)
- Light Grey: #c4c4c4 (muted)
- Off-White: #f5f5f5 (background)
- White: #ffffff

**Typography:**
- Display: Crimson Text (serif, elegant)
- Body: Inter (clean sans-serif)
- Hierarchy: Large display for headlines, medium body for copy, small for annotations

## Page Structure & Experience

### Route: /
**Duration:** Approximately 500vh (adjustable based on narrative pacing)
**Layout:** Scroll-driven single-page experience

### Core Components:

1. **ScrollVideo Component**
   - Fixed, full-viewport video background
   - Native HTML5 video element
   - Synced to document scroll (scrolls video from frame 0 to final frame)
   - Reads actual video duration from loadedmetadata
   - Smooth seek behavior with exponential damping
   - Loading overlay with progress indicator
   - Responsive and safe under StrictMode

2. **SmoothScroll Component**
   - Lenis smooth scrolling driven through GSAP ticker
   - No duplicate RAF loops
   - Synced with ScrollTrigger
   - Accessible keyboard/anchor navigation
   - Respects prefers-reduced-motion

3. **AutoTour Control**
   - Fixed position (bottom-right, mobile-responsive)
   - States: Start Tour -> Pause -> Resume -> Replay
   - Display: live progress percentage
   - Speed toggle: 1x (20 seconds total) / 2x (10 seconds total)
   - Dismissible on interaction (wheel, touch, keyboard)
   - Restart button appears after 2% progress
   - Clean, minimal styling matching the design system

4. **Experience Component**
   - Five scroll chapters synchronized to video progression:
     - VISION (0-10%): Eye reflection and emergence
     - FORM (10-30%): Sculptural to photorealistic transformation
     - VITALITY (30-50%): Body graphics and health visualization
     - ARCHITECTURE (50-75%): Structural evolution and space
     - LIVING (75-95%): Lifestyle and warmth
     - DIRECTION (95-100%): Final statement and CTA
   - Scrolling text that appears/fades with chapters
   - Subtle measurement instruments and annotations (SVG-based)
   - Minimalist interface that enhances, not obscures, the video
   - Professional CTA section with inquiry link
   - Link to /prompt/ page

### Route: /prompt/
**Content:** Self-contained reconstruction archive
**Sections:**
- Original video filename and path
- Brand positioning and visual system
- Narrative chapters (brief descriptions)
- Navigation concept
- Technical stack and architecture
- Scroll-video behavior specs
- Smooth scrolling requirements
- AutoTour behavior
- Responsive/accessibility requirements
- Full reconstruction prompt (this text)
- "Copy Prompt" button
- Link back to main experience

## Motion & Interaction Design

**Signature Motion Behaviors:**
1. Video Scrubbing - Scroll position directly controls video playback
2. Typography Staging - Text appears, transforms, and fades across chapters
3. Measurement Callouts - Animated SVG instruments and progress scales
4. Parallax Depth - Restrained background/foreground separation
5. Chapter Transitions - Palette and tone shifts as video evolves

**Avoid:**
- Floating UI elements unrelated to the film
- Excessive blur or glassmorphism
- Generic SaaS-style cards
- Horizontal overflow
- Unreadable small text
- Motion unrelated to the physical journey

## Technical Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite with @tailwindcss/vite
- **Styling:** Tailwind CSS v4
- **Animation:** GSAP 3.12+ with ScrollTrigger plugin
- **Smooth Scrolling:** Lenis 1.1+
- **Routing:** react-router-dom 6.27+
- **Icons:** lucide-react
- **Video:** Native HTML5 video element

## Scroll-Video Engine Requirements

- Read actual duration from loadedmetadata
- Map total document scroll progress to video currentTime
- Use exponential damping for smooth playhead movement
- Prevent stale seeks from moving playhead backward
- Handle seeking safely without building unbounded queues
- Support requestVideoFrameCallback where available
- Include loading overlay and buffered-progress indicator
- Support Safari and iOS
- Respect prefers-reduced-motion
- Remain safe under React StrictMode

## Responsive Design

- Desktop: Full experience with all animations and parallax
- Tablet: Touch-friendly controls, scaled down parallax
- Mobile: Single-column layout, simplified animations, accessible controls
- No horizontal overflow
- Touch-optimized button sizes
- Readable typography at all breakpoints

## Accessibility

- Semantic HTML
- Keyboard-operable all controls
- Visible focus states (#d4af37 outline)
- Sufficient contrast (WCAG AA+)
- ARIA labels for all interactive elements
- Decorative elements hidden from assistive tech
- Respect prefers-reduced-motion
- Avoid focus traps

## Commercial Copy

All page copy should be elegant, specific, and commercially compelling. Avoid:
- Generic freelancer language
- Vague AI marketing phrases
- Lorem ipsum
- Unqualified claims in regulated categories (beauty, health)

Focus on:
- Clear creative positioning
- Specific industry expertise
- Professional tone
- Strong, actionable CTAs

## Key Implementation Notes

1. All GSAP timelines must be cleaned up via gsap.context()
2. No duplicate GSAP plugin registration
3. ScrollTrigger should update through Lenis scroll events, not separate RAF
4. Video element must not have src removed during StrictMode cleanup
5. Use requestAnimationFrame for playhead easing (not direct video.currentTime sets)
6. AutoTour must not appear on /prompt/ route
7. Route navigation resets scroll to top immediately
8. All interactive elements must have visible keyboard focus
9. Motion should feel continuous and physically motivated
10. The video is the primary visual anchor; interface should enhance, not obscure

## Final State

The complete working website should:
- Load the hero video from /public/media/hero.mp4
- Display as a sophisticated, award-level commercial microsite
- Feel like premium creative studio work, not a generic template
- Be fully responsive and accessible
- Support both desktop and mobile experiences with equal care
- Include live AutoTour with speed control
- Display reconstruction prompt at /prompt/ with copy functionality
- Pass TypeScript strict mode with no errors
- Run npm run build successfully
- Feel cinematic, confident, and design-led
`

export default function PromptPage() {
  const promptRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(RECONSTRUCTION_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:px-8 sm:py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-serif font-semibold text-gray-900 mb-4">
            Reconstruction Prompt
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Complete blueprint for rebuilding this website. Use this prompt with another LLM to recreate the experience.
          </p>

          <button
            onClick={handleCopyPrompt}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            {copied ? (
              <>
                <Check size={18} />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy size={18} />
                Copy Prompt
              </>
            )}
          </button>
        </div>

        {/* Prompt Content */}
        <div
          ref={promptRef}
          className="prose prose-lg max-w-none text-gray-700"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: '1.8',
          }}
        >
          {RECONSTRUCTION_PROMPT.split('\n').map((line: string, i: number) => {
            if (line.startsWith('# ')) {
              return (
                <h1 key={i} className="text-4xl font-serif font-semibold text-gray-900 mt-12 mb-6">
                  {line.replace('# ', '')}
                </h1>
              )
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={i} className="text-2xl font-serif font-semibold text-gray-900 mt-10 mb-4">
                  {line.replace('## ', '')}
                </h2>
              )
            }
            if (line.startsWith('**') && line.includes(':')) {
              const [label, ...rest] = line.split(':')
              return (
                <p key={i} className="text-gray-700 mb-2">
                  <strong>{label.replace(/\*\*/g, '')}:</strong>
                  {rest.join(':').trim()}
                </p>
              )
            }
            if (line.startsWith('- ')) {
              return (
                <p key={i} className="text-gray-700 ml-6 mb-1">
                  •{' '}
                  <span>{line.substring(2)}</span>
                </p>
              )
            }
            if (line.trim() === '') {
              return <div key={i} className="h-2" />
            }
            return (
              <p key={i} className="text-gray-700 mb-3">
                {line}
              </p>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-900 hover:text-yellow-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 rounded-lg px-4 py-2 -ml-4"
          >
            &lt;- Back to Experience
          </Link>
        </div>
      </div>
    </div>
  )
}
