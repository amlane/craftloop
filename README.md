# CraftLoop

An AI-powered crochet pattern planner and publishing tool. This full-stack web application leverages generative AI to transform unstructured crafting notes and available supplies into standardized, mistake-free crochet patterns ready for publication on Etsy or personal blogs.

## 🚀 Live Demo

[View Live Deployment (Placeholder)](#) | [Developer Portfolio](#)

---

## 🛑 Project Status: Scoping & Architecture Phase

This repository is currently in the Product Specification & Architecture Design phase.
The feature scope, technical stack choices, and data boundaries have been mapped below.
Implementation is scheduled to begin next week.

_Last Updated: August 29, 2026_

---

## 🗺️ Product Roadmap & Milestones

CraftLoop executes a phased deployment strategy designed to de-risk complex AI text parsing, ensure flawless pattern logic, and ultimately create commercial digital assets optimized for direct-to-consumer marketplaces like Etsy.

```
┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐
│     Phase 1: Validation ──> │ │    Phase 2: Monetize    ──> │ │    Phase 3: Intelligence    │
│    Schema & React Preview   │ │  PDF Engine & Blog Export   │ │     Yarn Substitutions      │
└─────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────┘
```

### 🟩 Phase 1: Core Engine & Schema Validation (MVP) — _Current Phase_

**Objective:** Solve the primary technical risk—AI stitch hallucination—by locking down rigid schema boundaries and building a highly interactive editing interface.

- [ ] **Zod Schema Architecture:** Define and freeze the multi-level pattern JSON model (validating hook sizes, row sequences, repeats, and end-of-row stitch counts).
- [ ] **Structured LLM Pipeline:** Implement OpenAI Structured Outputs to enforce that user supply lists and casual notes compile perfectly into the data model.
- [ ] **Interactive Client Canvas:** Build the React/Next.js frontend pattern previewer using Zustand to manage interactive, checkable row-by-row lists.

### 🟨 Phase 2: Commercialization & High-Fidelity Export (V1.1)

**Objective:** Transform validated patterns into beautiful, downloadable digital products optimized for Etsy store compliance and SEO blog distribution.

- [ ] **Print-Optimized PDF Engine:** Build a server-side Headless Chrome/Puppeteer compilation route that maps pattern JSON into a premium, multiple-page PDF layout with customizable color themes.
- [ ] **Blog-Ready Markdown Exporter:** Create a specialized copy-paste engine formatting the pattern with semantic headings and abbreviation tables for SEO-friendly crafting blogs.
- [ ] **Etsy Product Guardrails:** Program automated pattern sanitization rules (e.g., auto-generating a "Materials Needed" cover page) to meet digital download standards.

### 🟦 Phase 3: Marketplace Intelligence & Advanced Features (V2.0)

**Objective:** Introduce proprietary functionality that transitions CraftLoop from a utility script into a defensible B2B2C product.

- [ ] **Smart Yarn Substitution Engine:** Integrate a localized lookup database allowing the AI to recommend exact alternative yarn brands based on matching weights, yards, and fiber content.
- [ ] **Image Optimization Pipeline:** Build an asset upload pipeline to let creators seamlessly anchor their own progress photos to specific pattern rows before exporting to PDF.

### 🟪 Phase 4: Ecosystem

**Objective:** Expand CraftLoop from a single-user tool into a publishing and growth platform for crafters.

- [ ] One-click Etsy-ready PDF formatting and export
- [ ] SEO-optimized blog/Markdown publishing templates
- [ ] Usage analytics dashboard (most-used stitches, popular patterns)
- [ ] Social/YouTube description generator for pattern videos
- [ ] Pattern sharing and community discovery features (e.g. Ravelry integration)

---

## 📋 Features

- **Intelligent Pattern Synthesis**: Converts casual input (e.g., "I have 2 skeins of blue worsted yarn, want to make a small beanie" or loose handwritten notes) into structured, row-by-row crochet blueprints.
- **Schema-Validated AI Outputs**: Utilizes strict JSON schema enforcement to ensure the AI never hallucinates illegal stitch combinations, missing row steps, or inaccurate stitch counts.
- **Dual-Format Export Engine**:
  - **Etsy-Ready PDF**: Generates a beautifully formatted, highly readable, printable PDF optimized for digital product stores.
  - **Blog-Ready Markdown**: Outputs clean, SEO-friendly Markdown text for quick copy-pasting into static blog sites.
- **Interactive Pattern Previewer**: Allows crafters to review, test, and manually tweak the generated pattern rows via a responsive client-side UI before downloading.

## 🛠️ Tech Stack

This project is built using React and Next.js to demonstrate proficiency in industry-standard frontend architecture, strict TypeScript data modeling, and robust API integration.

- **Frontend Framework**: Next.js 15+ (App Router) & React 19
- **Language**: TypeScript (for type safety across components and API data contracts)
- **Styling**: Tailwind CSS + Shadcn/ui (for an elegant, accessible component system)
- **State Management**: Zustand (lightweight client-side store to manage interactive pattern state)
- **Backend & Serverless**: Next.js Route Handlers (Serverless API endpoints)
- **AI Integration**: OpenAI API (Structured Outputs feature via gpt-4o)
- **Schema Validation**: Zod (runtime type checking and prompt constraint mapping)
- **Document Generation**: Puppeteer / Headless Chrome (server-side HTML-to-PDF rendering)

## 📐 Architecture & Data Flow

```
   ┌───────────────────────┐
   │ React Client UI       │ <─── Zustand State Management
   └──────────┬────────────┘
              │ (Notes & Supplies Payload)
              ▼
   ┌───────────────────────┐
   │ Next.js API Endpoint  │
   └──────────┬────────────┘
              │
      ┌───────┴────────────────────────┐
      ▼                                ▼
┌───────────────────────────┐    ┌───────────────────────────┐
│ OpenAI SDK + Zod Schema   │    │ Document Export Pipeline  │
│ (Enforces Strict JSON)    │    │ (PDF Kit / Markdown)      │
└───────────────────────────┘    └───────────────────────────┘
```

1. **Input**: The user specifies yarn weights, hook sizes, and a text description of what they want to make.
2. **Validation**: The server hits the OpenAI API passing a rigid Zod schema that mandates an exact pattern structure.
3. **Hydration**: The validated JSON response streams back to the React app, populating a client-side layout where users can check off rows dynamically.
4. **Compilation**: Upon export, the server compiles the template into a clean Markdown block or passes it to a PDF builder stream.

---

## 🧠 Engineering Highlights & Technical Challenges

### 1. Eliminating AI Hallucinations via Structured Outputs

Crochet patterns are highly technical scripts; a single missing stitch calculation completely ruins the final garment. Relying on raw text prompts often causes LLMs to forget stitch counts at the end of a row.

**Solution**: Implemented OpenAI's native Structured Outputs combined with a robust Zod runtime schema. If the LLM's response deviates by even one bracket or variable type, the API automatically retries or rejects the payload before it can corrupt the client-side state.

### 2. High-Fidelity PDF Generation

Generating modern, professional PDFs natively in JavaScript often results in messy layout shifts, broken page breaks, or un-stylable components.

**Solution**: Built a dedicated API route that uses a headless browser context to inject the pattern JSON into a print-optimized HTML/CSS boilerplate, producing a clean, beautifully styled PDF every time.

## 💻 Local Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com
   cd craftloop
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your environment variables. Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_secret_openai_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
