chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GENERATE_PROMPT") {

    const { input, mode } = request;

    if (!input) {
      sendResponse({ success: false, error: "Input is empty" });
      return;
    }

    const prompt = buildPrompt(input, mode);

    fetch("https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2", {
  method: "POST",
  headers: {
    "Authorization": "****",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    inputs: prompt,
    parameters: {
      max_new_tokens: 300,
      temperature: 0.7
    }
  })
}).then(res => {
      if (!res.ok) {
        throw new Error("API Error " + res.status);
      }
      return res.json();
    })
    .then(data => {
      let output = "";

if (Array.isArray(data)) {
  output = data[0]?.generated_text || "No output";
} else if (data.generated_text) {
  output = data.generated_text;
} else {
  output = JSON.stringify(data);
}t

      sendResponse({ success: true, output });
    })
    .catch(err => {
      sendResponse({ success: false, error: err.message });
    });

    return true;
  }
});

// ✅ Smart Prompt Builder
function buildPrompt(input, mode) {

  if (mode === "learning") {
    return `
Create an immersive, beginner-to-advanced tutorial on "${input}".

Structure:
1. Introduction (what & why)
2. Core concepts explained simply
3. Step-by-step examples
4. Mini project
5. Common mistakes
6. Advanced concepts
7. Learning roadmap

Style:
- Simple → deep explanation
- Use analogies
- Include examples
- Keep it engaging
`;
  }

  if (mode === "coding") {
    return `
Explain "${input}" with a strong focus on coding.

Structure:
1. Concept explanation
2. Code examples (basic → advanced)
3. Real-world use case
4. Best practices
5. Common bugs & fixes

Style:
- Clean code
- Comments included
- Practical focus
`;
  }

  if (mode === "research") {
    return `
Provide a deep research-level explanation of "${input}".

Structure:
1. Definition
2. Background & theory
3. Key components
4. Real-world applications
5. Pros & cons
6. Future trends

Style:
- Detailed
- Analytical
- Structured
`;
  }

  if (mode === "project") {
    return `
Create a complete project plan for "${input}".

Include:
1. Problem statement
2. Features
3. Tech stack
4. System design (HLD + LLD)
5. Step-by-step implementation
6. Possible challenges
7. Future improvements
`;
  }

  return `Explain ${input} in detail.`;
}