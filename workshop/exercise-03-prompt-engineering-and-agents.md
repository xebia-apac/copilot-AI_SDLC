# Exercise 03 — Prompt Engineering Workshop

**Duration**: Approximately 8 minutes in a preconfigured environment | **Goal**: Learn the four pillars of strong prompts.

---

## Background

**Prompt engineering** is writing clear, structured instructions to get better AI responses.

- Weak prompts = vague answers → rework needed
- Strong prompts = actionable answers → production-ready code

This workshop helps you to build strong prompts using four pillars and two practical techniques.

---

## The Four Pillars

| Pillar | Purpose | Example |
|--------|---------|---------|
| **Context** | Background information, environment, and constraints. | "I am working on a React project using TypeScript and Tailwind CSS..." |
| **Intent** | The goal or the specific action you want the AI to perform. | "Generate a responsive navigation bar component..." |
| **Clarity** | Use unambiguous language and define the persona. | "Act as a senior frontend developer and use functional components..." |
| **Specificity** | Detailed requirements, formatting, and edge cases. | "Include a mobile hamburger menu, a logo placeholder, and links for Home, About, and Contact. Return only the code." |

The synergy of these pillars ensures that the AI understands not just *what* to do, but *how* and *why* to do it within your specific project boundaries.

---

### Open Copilot Chat in Ask Mode

**Action**

1. Complete Exercise 01 and confirm that Copilot Chat opens and responds.
2. Open Copilot Chat using the Chat icon, the configured Chat shortcut, or the Command Palette. Keyboard shortcuts and UI labels can vary by VS Code and Copilot version.
3. Select **Ask** mode if a mode selector is available. Keep it active for the prompts in this exercise.

**Expected result**

Copilot Chat is open and ready for the prompt comparisons in this exercise.

**If unavailable**

If Ask mode is not shown, continue in the default conversational Chat mode.

## Build Strong Prompts: Vague → Improved

### Scenario 1: Creating a Data Utility

**Vague Prompt (High ambiguity):**
```
Write a function to format dates.
```

**Improved Prompt (Combining Context, Intent, Clarity, and Specificity):**
Open [workshop/sample-data/date_utils.js](../workshop/sample-data/date_utils.js), add it to Chat context if needed, and use this prompt in Chat:
```
You are a specialist in internationalization building a financial dashboard in a Node.js environment. Refactor the `formatDate` function in #readFile:date_utils.js to accept ISO 8601 date strings and return/display them in 'DD-MMM-YYYY' format (e.g., 19-Mar-2026). The function should take a date string and a locale as arguments. Use the locale where appropriate, and ensure it handles null or invalid date inputs by returning an empty string.
```

**Expected result:** Copilot proposes a refactored function with the requested arguments, output format, locale handling, and invalid-input behavior.

### Scenario 2: Refactoring Code

**Vague Prompt (Subjective request):**
```
Make this code better.
```

**Improved Prompt (Refining via Progressive Disclosure):**
Open [workshop/sample-data/process_legacy_data.py](../workshop/sample-data/process_legacy_data.py), add it to Chat context if needed, and use this prompt in Chat:
```
Act as a performance tuning expert. Refactor the `process_data` function in #readFile:process_legacy_data.py to improve performance and readability. Use the `pandas` library where appropriate for CSV files up to 1GB, explain the memory trade-offs or chunking strategy, and provide a brief explanation of the structural changes you made.
```

**Expected result:** Copilot proposes a clearer refactoring and explains the performance and memory trade-offs instead of assuming that pandas always uses less memory.

### Scenario 3: Documentation and Testing

**Vague Prompt (Missing requirements):**
```
Write tests for my component.
```

**Improved Prompt (Using Output Specification):**
Open [workshop/sample-data/Button.jsx](../workshop/sample-data/Button.jsx), add it to Chat context if needed, and use this prompt in Chat:
```
You are a Quality Engineer. Generate unit tests for the `Button` component in #readFile:Button.jsx using Vitest and React Testing Library. Follow the Arrange-Act-Assert (AAA) pattern. Ensure you test that the click handler is called when NOT loading, and that the button is disabled when the `isLoading` prop is true. Provide the code in a single file block with all necessary imports.
```

**Expected result:** Copilot proposes tests covering a click when `isLoading` is false and the disabled state when `isLoading` is true.

**Practice**

**Action:** Compare the output of a vague prompt with the corresponding improved prompt in Copilot Chat.

**Expected result:** The improved prompt produces a more relevant response with fewer follow-up questions or missing requirements.

---

## Two Prompting Techniques

**Technique 1 — Progressive Disclosure:**

**Action:** Send the following prompt, then send each follow-up in order:

```
You are a Python developer. Write password validation function.
```
Follow-up: `Now add: min 8 chars, 1 uppercase, 1 number, 1 special char.`
Follow-up: `Add 5 pytest test cases.`

**Expected result:** Each follow-up adds constraints to the same password-validation task, ending with five pytest cases.

**Technique 2 — Output Specification:**

**Action:** Send:

```
You are a DevOps Engineer. Compare REST vs GraphQL.
Output: markdown table, columns: Feature | REST | GraphQL | Best for. Keep 2-3 words per cell.
```

**Expected result:** Copilot returns a concise Markdown table with the requested columns and short cell values.


---

## Key Takeaways

- All four pillars together make production-ready prompts.
- Progressive disclosure: start simple, refine with follow-ups.
- Specify output format to prevent vague responses.
- Weak prompts skip one or more pillars.

---

---

**Next**: [Exercise 04 — Agents, Skills, Instructions, and Prompts](exercise-04-instructions-agent-skills.md)


