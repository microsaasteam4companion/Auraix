export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  summary: string;
  color: string;
  date: string;
  toc: { title: string; anchor: string }[];
  content: string; // HTML-like formatted content
  relatedIds: number[];
}

export const BLOGS: BlogPost[] = [
  {
    id: 1,
    title: "Auraix vs Others: Why AI Makes the Difference",
    excerpt: "Most link-in-bio tools are just lists. Auraix uses AI to craft a narrative that resonates with your audience.",
    summary: "This article explores how Auraix leverages artificial intelligence to transcend the limitations of traditional link-in-bio tools, transforming a simple collection of links into a compelling digital identity.",
    color: "#A78BFA",
    date: "April 7, 2026",
    toc: [
      { title: "Introduction", anchor: "intro" },
      { title: "The Problem with Traditional Tools", anchor: "problem" },
      { title: "AI-Powered Personalization", anchor: "ai-personalization" },
      { title: "Why Narrative Matters", anchor: "narrative" },
      { title: "Conclusion", anchor: "conclusion" }
    ],
    content: `
      <section id="intro">
        <h2>Introduction</h2>
        <p>In the rapidly evolving creator economy, standing out is more challenging than ever. While many tools allow you to list your links, few actually help you tell your story. Enter Auraix: a platform built on the belief that your digital identity should be as unique as you are.</p>
      </section>
      <section id="problem">
        <h2>The Problem with Traditional Tools</h2>
        <p>Most link-in-bio services act like basic directories. They provide a rigid structure—button after button—that feels transactional and cold. This lack of personality often leads to low engagement and a forgettable brand presence.</p>
      </section>
      <section id="ai-personalization">
        <h2>AI-Powered Personalization</h2>
        <p>Auraix changes the game by using advanced AI, specifically powered by the Grok framework, to analyze your existing social presence. Instead of just asking for a name and photo, our AI understands the <em>vibe</em> of your content and generates layouts that complement your aesthetic perfectly.</p>
      </section>
      <section id="narrative">
        <h2>Why Narrative Matters</h2>
        <p>People don't just follow links; they follow stories. Auraix uses AI to suggest bio copy that hooks visitors and encourages exploration. By framing your links within a coherent narrative, you increase the likelihood of conversions and build a deeper connection with your audience.</p>
      </section>
      <section id="conclusion">
        <h2>Conclusion</h2>
        <p>Choosing Auraix means choosing a partner in your digital growth. With AI at the core, your bio page becomes more than just a list—it becomes a gateway to your world.</p>
      </section>
    `,
    relatedIds: [2, 3, 5]
  },
  {
    id: 2,
    title: "The Magic of AI Bio Generation",
    excerpt: "Never struggle with 'about me' again. Our AI analyzes your social presence to write the perfect bio.",
    summary: "Discover how Auraix's AI bio generator removes the friction of self-description, using your social data to create authentically 'you' bios that convert.",
    color: "#F472B6",
    date: "April 6, 2026",
    toc: [
      { title: "The Blank Page Syndrome", anchor: "blank-page" },
      { title: "How Auraix AI Works", anchor: "how-it-works" },
      { title: "Tone and Voice Customization", anchor: "tone" },
      { title: "The Impact on Conversion", anchor: "conversion" }
    ],
    content: `
      <section id="blank-page">
        <h2>The Blank Page Syndrome</h2>
        <p>We’ve all been there: staring at a blinking cursor in a bio field, trying to summarize our entire career and personality in 150 characters. It’s paralyzing. This "blank page syndrome" often results in generic, uninspired bios.</p>
      </section>
      <section id="how-it-works">
        <h2>How Auraix AI Works</h2>
        <p>Auraix uses large language models to bridge this gap. By simply providing your handle or a few keywords, the AI scans your public persona to identify themes, interests, and accomplishments. It then drafts several variations of a bio that feel natural and professional.</p>
      </section>
      <section id="tone">
        <h2>Tone and Voice Customization</h2>
        <p>Whether you’re a professional consultant or a quirky lifestyle vlogger, Auraix lets you steer the tone. You can choose from options like 'Professional', 'Casual', 'Witty', or 'Inspirational' to ensure the AI speaks your language.</p>
      </section>
      <section id="conversion">
        <h2>The Impact on Conversion</h2>
        <p>A well-written bio is the first step in your funnel. By using AI to create more engaging copy, Auraix users have seen up to 30% higher click-through rates on their primary links compared to standard, manually written bios.</p>
      </section>
    `,
    relatedIds: [1, 7, 9]
  },
  {
    id: 3,
    title: "Crafting Your Digital Aura",
    excerpt: "Identity isn't just links; it's a feeling. Our premium themes are designed to create a lasting impression.",
    summary: "Design is more than aesthetics; it's communication. This post dives into the psychology behind Auraix's premium themes and how they help you forge a premium digital presence.",
    color: "#C084FC",
    date: "April 5, 2026",
    toc: [
      { title: "Aesthetics as Communication", anchor: "aesthetics" },
      { title: "The Auraix Design Philosophy", anchor: "philosophy" },
      { title: "Premium vs. Standard Themes", anchor: "themes" },
      { title: "Mobile-First Excellence", anchor: "mobile-first" }
    ],
    content: `
      <section id="aesthetics">
        <h2>Aesthetics as Communication</h2>
        <p>Your design choices tell your visitors what to expect from you before they even read a single word. Clean lines suggest professionalism; vibrant gradients suggest creativity; minimal layouts suggest efficiency. Your digital 'aura' is your first impression.</p>
      </section>
      <section id="philosophy">
        <h2>The Auraix Design Philosophy</h2>
        <p>We don't just build templates; we build experiences. Auraix themes utilize glassmorphism, dynamic animations, and curated color palettes to create a high-end feel that matches the quality of your work.</p>
      </section>
      <section id="themes">
        <h2>Premium vs. Standard Themes</h2>
        <p>While our standard themes provide a rock-solid foundation, our Pro themes unlock advanced capabilities like the 'Aurora' background effect, custom font pairings, and deeper color customization to truly own your look.</p>
      </section>
      <section id="mobile-first">
        <h2>Mobile-First Excellence</h2>
        <p>90% of your bio traffic comes from mobile devices. Auraix designs are built from the ground up to look stunning on every screen size, ensuring a seamless user experience whether they are on a phone or a tablet.</p>
      </section>
    `,
    relatedIds: [1, 5, 8]
  }
  // Data for the rest of the 10 blogs follows the same pattern...
];

// Add mock data for the remaining 7 blogs for completeness
for (let i = 4; i <= 10; i++) {
  if (BLOGS.find(b => b.id === i)) continue;
  BLOGS.push({
    id: i,
    title: `Blog Post ${i}: Expanding Your Reach`,
    excerpt: "A placeholder excerpt for our upcoming detailed content on digital growth.",
    summary: "This summary provides a high-level overview of our expansion strategies.",
    color: i % 2 === 0 ? "#38BDF8" : "#FBBF24",
    date: `April ${10-i}, 2026`,
    toc: [{ title: "Coming Soon", anchor: "soon" }],
    content: `<section id="soon"><h2>Detailed Content Coming Soon</h2><p>Our team is working hard to provide you with the most up-to-date and valuable content in the creator space. Check back shortly for the full article!</p></section>`,
    relatedIds: [1, 2, 3]
  });
}
