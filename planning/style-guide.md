# Rosie Design System & Style Guide
## Caregiver Onboarding Chat Agent

**Version:** 1.0  
**Last Updated:** November 4, 2025  
**Based on:** Rosie Homepage Design

---

## 1. Color Palette

### 1.1 Primary Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Rosie Coral** | `#F4B9A8` | rgb(244, 185, 168) | Primary buttons, CTAs, brand accents |
| **Coral Hover** | `#F2A893` | rgb(242, 168, 147) | Button hover states |
| **Coral Active** | `#E89880` | rgb(232, 152, 128) | Button active/pressed states |

### 1.2 Neutral Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Pure White** | `#FFFFFF` | rgb(255, 255, 255) | Text on dark backgrounds, cards, containers |
| **Off White** | `#FEFEFE` | rgb(254, 254, 254) | Background for profile preview panel |
| **Light Gray** | `#F5F5F5` | rgb(245, 245, 245) | Subtle backgrounds, dividers |
| **Medium Gray** | `#E0E0E0` | rgb(224, 224, 224) | Borders, inactive states |
| **Text Gray** | `#757575` | rgb(117, 117, 117) | Secondary text, timestamps |
| **Charcoal** | `#4A4A4A` | rgb(74, 74, 74) | Badge backgrounds, pills |
| **Dark Charcoal** | `#2C2C2C` | rgb(44, 44, 44) | Primary text on light backgrounds |

### 1.3 Semantic Colors

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| **Success Green** | `#4CAF50` | rgb(76, 175, 80) | Completion states, checkmarks |
| **Warning Amber** | `#FF9800` | rgb(255, 152, 0) | Missing critical fields alerts |
| **Error Red** | `#F44336` | rgb(244, 67, 54) | Error states, validation failures |
| **Info Blue** | `#2196F3` | rgb(33, 150, 243) | Informational messages |

### 1.4 Background & Overlay

| Color Name | Hex Code | RGBA | Usage |
|------------|----------|------|-------|
| **Dark Overlay** | `#000000` | rgba(0, 0, 0, 0.4) | Overlay on hero images |
| **Light Overlay** | `#FFFFFF` | rgba(255, 255, 255, 0.95) | Chat message backgrounds |
| **Badge Background** | `#4A4A4A` | rgba(74, 74, 74, 0.75) | Semi-transparent badges |

---

## 2. Typography

### 2.1 Font Families

```css
/* Primary Font Stack (Serif - for headlines) */
font-family: 'Merriweather', 'Georgia', 'Times New Roman', serif;

/* Secondary Font Stack (Sans-serif - for body) */
font-family: 'Inter', 'Helvetica Neue', 'Arial', sans-serif;

/* Monospace (for code/technical content if needed) */
font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
```

### 2.2 Type Scale

| Style | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| **H1 Hero** | Merriweather | 64px / 4rem | 700 (Bold) | 1.2 | -0.02em | Main hero headline |
| **H2 Large** | Merriweather | 48px / 3rem | 700 (Bold) | 1.3 | -0.01em | Section headlines |
| **H3 Medium** | Merriweather | 32px / 2rem | 600 (Semi-bold) | 1.4 | 0 | Subsection headers |
| **H4 Small** | Inter | 24px / 1.5rem | 600 (Semi-bold) | 1.5 | 0 | Card headers |
| **Body Large** | Inter | 18px / 1.125rem | 400 (Regular) | 1.6 | 0 | Main subheadlines |
| **Body Regular** | Inter | 16px / 1rem | 400 (Regular) | 1.6 | 0 | Chat messages, body text |
| **Body Small** | Inter | 14px / 0.875rem | 400 (Regular) | 1.5 | 0 | Timestamps, captions |
| **Button Text** | Inter | 16px / 1rem | 600 (Semi-bold) | 1 | 0.02em | Button labels |
| **Badge Text** | Inter | 14px / 0.875rem | 500 (Medium) | 1.4 | 0.01em | Badge/pill labels |

### 2.3 Font Weights Available

- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **Semi-bold:** 600
- **Bold:** 700

---

## 3. Component Styles

### 3.1 Buttons

#### Primary Button (Coral CTA)
```css
.btn-primary {
  background: #F4B9A8;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 16px 32px;
  border-radius: 50px; /* Fully rounded */
  border: none;
  box-shadow: 0 2px 8px rgba(244, 185, 168, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #F2A893;
  box-shadow: 0 4px 12px rgba(244, 185, 168, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active {
  background: #E89880;
  transform: translateY(0);
}
```

#### Secondary Button (Text/Ghost)
```css
.btn-secondary {
  background: transparent;
  color: #FFFFFF;
  border: 2px solid #FFFFFF;
  padding: 14px 30px;
  border-radius: 50px;
  font-weight: 600;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

#### Icon Button
```css
.btn-icon {
  background: transparent;
  color: #F4B9A8;
  padding: 12px;
  border-radius: 50%;
  border: none;
}

.btn-icon:hover {
  background: rgba(244, 185, 168, 0.1);
}
```

### 3.2 Chat Messages

#### User Message (Right-aligned)
```css
.message-user {
  background: #F4B9A8;
  color: #FFFFFF;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  max-width: 70%;
  margin-left: auto;
  font-size: 16px;
  line-height: 1.6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

#### Agent Message (Left-aligned)
```css
.message-agent {
  background: #FFFFFF;
  color: #2C2C2C;
  padding: 12px 16px;
  border-radius: 18px 18px 18px 4px;
  max-width: 70%;
  margin-right: auto;
  font-size: 16px;
  line-height: 1.6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #E0E0E0;
}
```

#### Message Timestamp
```css
.message-timestamp {
  color: #757575;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 400;
}
```

### 3.3 Badges/Pills

```css
.badge {
  background: rgba(74, 74, 74, 0.75);
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.badge-icon {
  width: 20px;
  height: 20px;
}
```

### 3.4 Input Fields

```css
.input-text {
  background: #FFFFFF;
  border: 2px solid #E0E0E0;
  border-radius: 24px;
  padding: 14px 20px;
  font-size: 16px;
  color: #2C2C2C;
  transition: all 0.2s ease;
}

.input-text:focus {
  border-color: #F4B9A8;
  outline: none;
  box-shadow: 0 0 0 3px rgba(244, 185, 168, 0.1);
}

.input-text::placeholder {
  color: #757575;
}
```

### 3.5 Profile Preview Card

```css
.profile-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #E0E0E0;
}

.profile-field {
  margin-bottom: 16px;
}

.profile-label {
  color: #757575;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.profile-value {
  color: #2C2C2C;
  font-size: 16px;
  font-weight: 400;
}

.profile-value-empty {
  color: #E0E0E0;
  font-style: italic;
}

.profile-value-filled {
  color: #4CAF50;
  font-weight: 500;
}
```

---

## 4. Spacing System

Use a consistent 8px base spacing unit:

```css
--space-xs: 4px;    /* 0.25rem */
--space-sm: 8px;    /* 0.5rem */
--space-md: 16px;   /* 1rem */
--space-lg: 24px;   /* 1.5rem */
--space-xl: 32px;   /* 2rem */
--space-2xl: 48px;  /* 3rem */
--space-3xl: 64px;  /* 4rem */
--space-4xl: 96px;  /* 6rem */
```

### 4.1 Component Spacing

| Element | Padding | Margin | Gap |
|---------|---------|--------|-----|
| Chat container | 24px | - | - |
| Message bubbles | 12px 16px | 8px bottom | - |
| Buttons | 16px 32px | - | - |
| Input fields | 14px 20px | - | - |
| Profile cards | 24px | 16px bottom | - |
| Badge/pills | 10px 20px | - | 8px (between badges) |
| Section headers | - | 32px bottom | - |

---

## 5. Border Radius

```css
--radius-sm: 8px;    /* Small cards, inputs */
--radius-md: 16px;   /* Cards, containers */
--radius-lg: 24px;   /* Inputs, pills */
--radius-xl: 50px;   /* Buttons (fully rounded) */
--radius-full: 9999px; /* Circular elements */
```

---

## 6. Shadows

```css
/* Elevation levels */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.12);

/* Colored shadows (for CTAs) */
--shadow-coral: 0 2px 8px rgba(244, 185, 168, 0.3);
--shadow-coral-hover: 0 4px 12px rgba(244, 185, 168, 0.4);
```

---

## 7. Icons & Emojis

### 7.1 Icon Style
- Use outlined style for consistency
- Icon size: 20px standard, 24px for important actions
- Icon color: Inherit from parent or use `#757575` for neutral

### 7.2 Emoji Usage (from homepage)
- 💬 Chat/messaging
- ✨ AI/magic/special features
- 🛡️ Security/vetted
- 🎨 Creativity/customization
- ✅ Completion/success

---

## 8. Layout Guidelines

### 8.1 Chat Interface Layout

```
┌─────────────────────────────────────────────────┐
│  Header: "Rosie" logo + status                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Chat Message Container]                       │
│    Agent message (left)                         │
│    User message (right)                         │
│    Agent message (left)                         │
│    ...                                          │
│                                                 │
├─────────────────────────────────────────────────┤
│  Input: [Text field] [Voice button] [Send]     │
└─────────────────────────────────────────────────┘
```

### 8.2 Desktop Layout (with Profile Preview)

```
┌──────────────────────────────┬────────────────┐
│                              │                │
│   Chat Interface             │   Profile      │
│   (60-70% width)             │   Preview      │
│                              │   (30-40%)     │
│                              │                │
└──────────────────────────────┴────────────────┘
```

### 8.3 Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small desktops */
--breakpoint-xl: 1280px;  /* Large desktops */
```

---

## 9. Motion & Animation

### 9.1 Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### 9.1 Animation Durations

```css
--duration-fast: 150ms;   /* Quick interactions */
--duration-base: 200ms;   /* Standard transitions */
--duration-slow: 300ms;   /* Emphasized transitions */
--duration-slower: 500ms; /* Page transitions */
```

### 9.3 Common Animations

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up (for messages) */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse (for active states) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

---

## 10. Accessibility

### 10.1 Color Contrast Ratios

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| White on Coral (#FFFFFF on #F4B9A8) | 2.8:1 | ⚠️ AA Large only |
| Charcoal on White (#2C2C2C on #FFFFFF) | 14.7:1 | ✅ AAA |
| Text Gray on White (#757575 on #FFFFFF) | 4.6:1 | ✅ AA |
| White on Dark Overlay (#FFFFFF on rgba(0,0,0,0.4)) | Varies | Check context |

**Note:** For primary coral buttons, ensure text is bold (600+) for readability.

### 10.2 Focus States

```css
.focus-visible {
  outline: 3px solid #F4B9A8;
  outline-offset: 2px;
}
```

### 10.3 Screen Reader Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 11. Voice & Tone (Visual)

### 11.1 Design Principles
- **Warm:** Use soft colors, rounded corners, friendly spacing
- **Clean:** Minimize clutter, use white space generously
- **Human:** Photos over illustrations, conversational copy
- **Trustworthy:** Professional typography, subtle shadows

### 11.2 Do's and Don'ts

✅ **Do:**
- Use large, readable fonts (minimum 16px for body)
- Keep message bubbles distinct with clear alignment
- Show clear visual feedback for interactions
- Use the coral accent color sparingly for emphasis
- Maintain consistent spacing throughout

❌ **Don't:**
- Use harsh shadows or sharp corners
- Overcrowd the interface with too many elements
- Use all-caps extensively (only for small labels)
- Mix too many different fonts
- Use pure black (#000000) for text - use charcoal instead

---

## 12. Implementation Notes

### 12.1 CSS Custom Properties (Variables)

```css
:root {
  /* Colors */
  --color-coral: #F4B9A8;
  --color-coral-hover: #F2A893;
  --color-coral-active: #E89880;
  --color-white: #FFFFFF;
  --color-gray-50: #F5F5F5;
  --color-gray-200: #E0E0E0;
  --color-gray-500: #757575;
  --color-charcoal: #4A4A4A;
  --color-dark: #2C2C2C;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-coral: 0 2px 8px rgba(244, 185, 168, 0.3);
  
  /* Typography */
  --font-serif: 'Merriweather', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Transitions */
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 12.2 Tailwind Config (if using Tailwind)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#F4B9A8',
          hover: '#F2A893',
          active: '#E89880',
        },
        charcoal: {
          DEFAULT: '#4A4A4A',
          dark: '#2C2C2C',
        },
        gray: {
          text: '#757575',
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'chat': '18px',
      },
      boxShadow: {
        'coral': '0 2px 8px rgba(244, 185, 168, 0.3)',
        'coral-hover': '0 4px 12px rgba(244, 185, 168, 0.4)',
      }
    }
  }
}
```

---

## 13. Sample Component Code

### 13.1 React Component Example

```jsx
// Primary Button Component
export const Button = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = "px-8 py-4 rounded-full font-semibold text-base transition-all duration-200";
  
  const variants = {
    primary: "bg-[#F4B9A8] text-white hover:bg-[#F2A893] active:bg-[#E89880] shadow-coral hover:shadow-coral-hover",
    secondary: "bg-transparent text-white border-2 border-white hover:bg-white/10",
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

// Chat Message Component
export const ChatMessage = ({ message, sender }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`
        max-w-[70%] px-4 py-3 text-base leading-relaxed
        ${isUser 
          ? 'bg-[#F4B9A8] text-white rounded-[18px_18px_4px_18px]' 
          : 'bg-white text-[#2C2C2C] border border-gray-200 rounded-[18px_18px_18px_4px]'
        }
        shadow-sm animate-slideUp
      `}>
        {message}
      </div>
    </div>
  );
};
```

---

## 14. Quick Reference Card

### Essential Values to Remember

```
Primary Color:    #F4B9A8 (Rosie Coral)
Primary Text:     #2C2C2C (Dark Charcoal)
Secondary Text:   #757575 (Medium Gray)
Background:       #FFFFFF (White)

Main Font:        Inter (Sans-serif)
Heading Font:     Merriweather (Serif)

Button Padding:   16px 32px
Button Radius:    50px (fully rounded)
Message Padding:  12px 16px
Message Radius:   18px

Base Spacing:     8px increments
Shadow:           0 2px 8px rgba(0,0,0,0.08)
Transition:       200ms ease-in-out
```

---

**End of Style Guide**

*This style guide provides all the design tokens and components needed to build a chat interface that matches the Rosie brand aesthetic. Use these values consistently for a cohesive user experience.*
