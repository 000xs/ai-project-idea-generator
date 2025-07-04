// app/api/project/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { projectTypes, otherIdea } = await req.json();

    // Determine subject with fallbacks
    const subject = otherIdea?.trim() || "frogs"; // Default to frogs if empty

    // Handle project types
    const typesString =
      Array.isArray(projectTypes) && projectTypes.length > 0
        ? projectTypes.join(", ")
        : "anything";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Generate exactly 10 innovative, productive, and cool AI project ideas that are lit and inspiring.
    Requirements:
    - Focus: ${subject}
    - Project types: ${typesString}
    - Each idea must be 1 line maximum
    - Format as a numbered list (1. Idea 1\n2. Idea 2\n...)
    - Blend creativity with real-world utility
    - Prioritize projects with practical applications
    - Include modern tech integrations

    Example:
    1. AI-powered study assistant that generates personalized learning paths
    2. Smart campus navigation app that optimizes routes using real-time data
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Improved parsing algorithm
    const parseIdeas = (text) => {
      return (
        text
          .split("\n")
          // Match numbered lines with various formats
          .filter((line) => /^\s*\d+[.)]\s+.+$/.test(line))
          // Clean the text
          .map((line) =>
            line
              .replace(/^\s*\d+[.)]\s*/, "") // Remove numbering
              .replace(/["-]\s*$/, "") // Remove trailing quotes/dashes
              .trim()
          )
          // Return max 10 ideas
          .slice(0, 10)
      );
    };

    let ideas = parseIdeas(text);

    // Fallback if we didn't get enough valid ideas
    if (ideas.length < 5) {
      console.warn("Received insufficient ideas, using fallback");
      ideas = [
        `AI that generates memes about ${subject}`,
        `Voice-controlled ${subject} with attitude`,
        `Tinder for ${subject} using facial recognition`,
        `${subject} fitness tracker with shame features`,
        `AR app that puts ${subject} in all your photos`,
        `Smart ${subject} feeder that requires solving puzzles`,
        `${subject} translator that speaks in sarcasm`,
        `NFT generator for virtual ${subject}`,
        `${subject} weather predictor with sassy forecasts`,
        `AI-powered ${subject} dating coach`,
      ];
    }

    return new Response(JSON.stringify({ ideas }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return new Response(
      JSON.stringify({
        error:
          "Gemini failed to generate ideas. Try again with different inputs!",
        ideas: [
          // Always return ideas array even on error
          "AI plant that tweets when it's thirsty",
          "Smart toilet paper dispenser with judgmental AI",
          "Toaster that generates edible memes",
          "Fitness tracker that publicly shames you",
          "AI-generated pickup lines for awkward situations",
        ],
      }),
      {
        status: 500,
      }
    );
  }
}
