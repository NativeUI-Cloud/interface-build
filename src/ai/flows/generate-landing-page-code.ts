
'use server';
/**
 * @fileOverview A Genkit flow to generate Next.js landing page code from a description.
 *
 * - generateLandingPageCode - A function that generates Next.js landing page code.
 * - GenerateLandingPageCodeInput - The input type for the generateLandingPageCode function.
 * - GenerateLandingPageCodeOutput - The return type for the generateLandingPageCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateLandingPageCodeInput } from '@/lib/types'; // Use type from lib

const GenerateLandingPageCodeInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the landing page, including sections like hero, features, CTA, and footer. For a meme token, mention its name, theme (e.g., dog, cat, space), key memes/features, and desired sections.'),
  primaryColor: z
    .string()
    .default('#1A202C')
    .describe('The primary color for the landing page in hex format (e.g., for headings, main buttons).'),
  secondaryColor: z
    .string()
    .default('#EDF2F7')
    .describe('The secondary color for the landing page in hex format (e.g., for backgrounds or secondary text).'),
  accentColor: z
    .string()
    .default('#F56565') // Changed to a more playful default for meme potential
    .describe('The accent color for the landing page in hex format (e.g., for highlights, links, call-to-action buttons).'),
  pageTitle: z
    .string()
    .optional()
    .describe('The title for the landing page (e.g., "Super Doge Moon Rocket").'),
});

const GenerateLandingPageCodeOutputSchema = z.object({
  code: z.string().describe('The generated Next.js React functional component code for the landing page.'),
});
export type GenerateLandingPageCodeOutput = z.infer<typeof GenerateLandingPageCodeOutputSchema>;


export async function generateLandingPageCode(input: GenerateLandingPageCodeInput): Promise<GenerateLandingPageCodeOutput> {
  return generateLandingPageCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLandingPageCodePrompt',
  input: {schema: GenerateLandingPageCodeInputSchema},
  output: {schema: GenerateLandingPageCodeOutputSchema},
  prompt: `You are an expert Next.js developer specializing in creating modern, responsive, and engaging landing pages using React, Tailwind CSS, and ShadCN UI components where appropriate.

You will generate a single-file Next.js functional component for a landing page based on the user's description and color preferences.

**User Request Details:**
Description: {{{description}}}
Page Title: {{{pageTitle}}}
Primary Color: {{{primaryColor}}}
Secondary Color: {{{secondaryColor}}}
Accent Color: {{{accentColor}}}

**Instructions:**
1.  **Understand the Goal:** The user wants a landing page. If the description mentions "meme token", "crypto meme", or similar, ensure the design is playful, community-focused, and includes typical meme token sections. Otherwise, generate a standard professional landing page.
2.  **Structure - General Landing Page:**
    *   A compelling Hero section (with a headline, sub-headline, and a call-to-action button).
    *   A Features section (e.g., 3-4 feature blocks with icons, titles, and descriptions).
    *   A Call to Action (CTA) section.
    *   A Footer (with copyright and simple links if appropriate).
3.  **Structure - Meme Token Landing Page (if applicable):**
    *   **Hero Section:** Catchy, humorous title. Brief, engaging description of the meme token. Prominent "Buy Now" / "Join Community" button. Placeholder for a logo or meme image.
    *   **About/Story Section:** A fun or quirky "story" behind the meme token.
    *   **Tokenomics Section:** Placeholders for Total Supply, Symbol, Contract Address (mention it's a placeholder), and any special features like reflections, burn, or taxes (e.g., "Buy/Sell Tax: X%").
    *   **Roadmap Section:** A playful or ambitious roadmap (e.g., "Phase 1: Launch", "Phase 2: Moon", "Phase 3: Mars").
    *   **How to Buy Section:** Simple steps, e.g., "1. Get a Wallet", "2. Add ETH/BNB", "3. Swap on Uniswap/PancakeSwap". Placeholder for a DEX link.
    *   **Community/Socials Section:** Placeholders for links to Twitter, Telegram, Discord.
    *   **Footer:** Copyright, token name, simple disclaimer (e.g., "Not financial advice. DYOR.").
4.  **Content:** Use placeholder text for headlines, descriptions, etc., but make it relevant to the described page (e.g., "The Next Big Meme!", "Amazing Product Headline"). For meme tokens, use fun and engaging placeholder text.
5.  **Styling:**
    *   Use Tailwind CSS for all styling.
    *   Incorporate the provided colors semantically (e.g., accent for CTAs, primary for important text/elements).
    *   Ensure a modern, clean, and professional design. For meme tokens, make it vibrant and engaging, possibly with a slightly less formal feel, but still well-structured.
    *   The page should be responsive.
6.  **Components:**
    *   Use standard HTML elements styled with Tailwind.
    *   You MAY use ShadCN UI components if they fit naturally (e.g., \`Button\`, \`Card\` for feature blocks or roadmap items). Import them from \`@/components/ui/...\`.
    *   Assume all \`lucide-react\` icons are available for import if you choose to use them for feature icons, social media icons, etc.
7.  **Images & Logos:**
    *   Use the \`next/image\` component for all images and logos.
    *   For placeholders, use \`https://placehold.co/<width>x<height>.png\` (e.g., \`https://placehold.co/600x400.png\`).
    *   **Crucially, add a \`data-ai-hint\` attribute to each \`next/image\` component**. The value should be one or two keywords describing the image, which can be used later for image search.
        *   For general pages: \`data-ai-hint="abstract background"\`, \`data-ai-hint="team working"\`.
        *   For meme token pages: \`data-ai-hint="funny dog"\`, \`data-ai-hint="rocket moon"\`, \`data-ai-hint="meme character"\`, \`data-ai-hint="token logo"\`.
8.  **Code Format:**
    *   Generate a single React functional component.
    *   The component should be self-contained in one file (e.g., \`export default function LandingPage() { ... }\`).
    *   Include necessary imports at the top (\`React\`, \`next/image\`, \`lucide-react\` icons, any ShadCN components).
    *   Return only the code for the component. Do NOT include any surrounding text, explanations, or markdown backticks.
9.  **Page Title:** If a pageTitle is provided ({{{pageTitle}}}), incorporate it into a main heading or hero section. If not, derive one from the description.

Generate the Next.js component code now.
`,
});

const generateLandingPageCodeFlow = ai.defineFlow(
  {
    name: 'generateLandingPageCodeFlow',
    inputSchema: GenerateLandingPageCodeInputSchema,
    outputSchema: GenerateLandingPageCodeOutputSchema,
  },
  async (input: GenerateLandingPageCodeInput) => { // Explicitly type input here
    const {output} = await prompt(input);
    return output!;
  }
);
