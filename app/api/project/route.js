// app/api/project/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { projectTypes, otherIdea, generateAIIdeas } = await req.json(); // Re-added generateAIIdeas

    // Determine subject with fallbacks
    const subject = otherIdea?.trim() || "a random topic";

    // Handle project types
    const typesString =
      Array.isArray(projectTypes) && projectTypes.length > 0
        ? projectTypes.join(", ")
        : "anything";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const basePrompt = `
    Your task is to generate exactly 5 highly innovative, practical, and professional project ideas. These ideas should be suitable for academic projects, career development, or real-world solutions.
    `;

    const aiSpecificPrompt = `
    You are an expert innovation consultant specializing in AI and technology. Your task is to generate exactly 5 highly innovative, practical, and professional AI project ideas. These ideas should be suitable for academic projects, career development, or real-world solutions.
    `;

    const prompt = `
    ${generateAIIdeas ? aiSpecificPrompt : basePrompt}

    For each project idea, provide the following structured information:

    1.  **Title:** A concise, engaging, and professional title (max 10 words).
    2.  **Description:** A 2-3 sentence summary explaining the project's core concept, purpose, and value proposition. Focus on clarity and impact.
    3.  **Key Features:** A bulleted list of 3-5 essential functionalities or components of the project.
    4.  **Suggested Tech Stack:** A list of relevant technologies, frameworks, and programming languages that could be used to implement the project (e.g., Python, TensorFlow, Next.js, React Native, AWS, etc.).
    5.  **Difficulty Level:** An assessment of the project's complexity, categorized as "Beginner", "Intermediate", or "Advanced".

    Constraints and Guidelines:
    -   **Quantity:** Generate exactly 5 distinct project ideas.
    -   **Focus Area:** The primary focus or subject for these ideas is: "${subject}".
    -   **Project Types:** The ideas should primarily align with these types: "${typesString}".
    -   **Quality:** Ensure ideas are innovative, practical, and demonstrate real-world utility. Avoid overly simplistic or unrealistic concepts.
    -   **Format:** Adhere strictly to the specified markdown format with bolded headings and bullet points. Do not include any introductory or concluding remarks outside of the structured ideas.
    -   **Tone:** The ideas should be ${generateAIIdeas ? '"AI-focused" and leverage AI technologies' : '"normal" and generally applicable, not exclusively focused on AI unless specified by the subject or project types'}.

    Example of a well-formatted idea:
    **Title:** AI-Driven Personalized Study Assistant
    **Description:** Develop an intelligent assistant that adapts to a student's learning style and progress. It provides personalized study plans, identifies knowledge gaps, and recommends tailored resources to optimize learning outcomes.
    **Key Features:**
    -   Adaptive learning path generation
    -   Performance analytics and feedback
    -   Resource recommendation engine
    -   Interactive Q&A module
    **Suggested Tech Stack:** Python (TensorFlow/PyTorch), React, Node.js, MongoDB
    **Difficulty Level:** Intermediate
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const parseIdeas = (text) => {
      const ideas = [];
      const ideaBlocks = text.split('**Title:**').slice(1);

      ideaBlocks.forEach(block => {
        const titleMatch = block.match(/(.*?)\s*\*\*Description:\*\*/);
        const descriptionMatch = block.match(/\*\*Description:\*\*\s*(.*?)\s*\*\*Key Features:\*\*/);
        const featuresMatch = block.match(/\*\*Key Features:\*\*\s*([\s\S]*?)\s*\*\*Suggested Tech Stack:\*\*/);
        const techStackMatch = block.match(/\*\*Suggested Tech Stack:\*\*\s*(.*?)\s*\*\*Difficulty Level:\*\*/);
        const difficultyMatch = block.match(/\*\*Difficulty Level:\*\*\s*(.*)/);

        if (titleMatch && descriptionMatch && featuresMatch && techStackMatch && difficultyMatch) {
          const features = featuresMatch[1].split('\n').map(f => f.trim()).filter(f => f.startsWith('-')).map(f => f.substring(1).trim());
          ideas.push({
            title: titleMatch[1].trim(),
            description: descriptionMatch[1].trim(),
            features: features,
            techStack: techStackMatch[1].trim(),
            difficulty: difficultyMatch[1].trim(),
          });
        }
      });

      return ideas;
    };

    let ideas = parseIdeas(text);

    if (ideas.length === 0) {
      console.warn("Received no valid ideas, using fallback");
      ideas = [
        {
          title: `AI Meme Generator for ${subject}`,
          description: `A tool that creates memes about ${subject}.`,
          features: ['Generates memes', 'Shares on social media'],
          techStack: 'Python, Pillow',
          difficulty: 'Easy'
        }
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
