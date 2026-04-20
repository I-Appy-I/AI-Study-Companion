import axios from 'axios';

// We switched to using VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateStudyMaterial = async (prompt, type) => {
  if (!API_KEY) {
    // Mock response for development/testing if no API KEY is provided
    return new Promise((resolve) => {
      setTimeout(() => {
        let content = "";
        if (type === 'summary') {
          content = "Here is a generated summary for your topic:\n\nThis is an important concept that involves understanding the core principles. It is widely used in many applications across computer science.\n\nKey Takeaways:\n- Always understand the time complexity.\n- Practice makes perfect.\n- Review edge cases.";
        } else if (type === 'questions') {
          content = "1. What is the fundamental purpose of this concept?\n2. How does it compare to alternative approaches or algorithms?\n3. Can you provide a real-world application mapping to this topic?\n4. What are the common pitfalls when implementing this?\n5. Describe the space and time complexity.";
        } else {
          content = "Flashcard 1\nFront: Core Definition\nBack: Brief explanation of what it is and does.\n\nFlashcard 2\nFront: Key Advantage\nBack: Why we use it over other generic methods.\n\nFlashcard 3\nFront: Worst Case Scenario\nBack: The big O notation performance limitation.";
        }
        resolve(content);
      }, 1500);
    });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              { 
                text: `You are an expert AI study companion helping a student. Generate highly helpful, concise, well-structured study material based on this request:\n\n${prompt}` 
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extracting response from Gemini JSON format
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("AI Generation Error", error);
    throw new Error(error.response?.data?.error?.message || 'Failed to generate content. Please check your connection or API key.');
  }
};
