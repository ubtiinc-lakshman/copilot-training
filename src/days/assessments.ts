import type { Question } from "@/components/Quiz";

// Basic level assessment questions (from the Basic assessment questionnaires).
export const QUIZZES: Record<number, Question[]> = {
  1: [
    { q: "Which best describes GitHub Copilot?", type: "mcq", correct: 1, answer: "B", options: ["An autonomous developer that ships code without review", "An in-editor AI suggestion/chat tool whose output you must evaluate", "A version-control system", "A project-management tool"] },
    { q: "Every Copilot suggestion is guaranteed to be correct and can be accepted without review.", type: "tf", correct: false, answer: "False: suggestions always need human review." },
    { q: "Name one of the five AI agents the org uses and what it is best for.", type: "short", keywords: ["opus", "sonnet", "haiku", "gpt", "copilot"], answer: "Copilot (in-editor), Claude Opus (planning), Sonnet (implementation), Haiku (quick docs), GPT-4/MS Copilot (architecture)." },
    { q: "Where does Day 1 sit in the AI Enabled Development Guide's 7-phase workflow?", type: "short", keywords: ["orientation", "all phases", "every phase", "across"], answer: "Orientation: it cuts across all seven phases." },
    { q: "Complete the phrase: \"Copilot suggests, you ____.\"", type: "short", keywords: ["decide"], answer: "decide" },
  ],
  3: [
    { q: "The most common miss when blindly accepting an inline suggestion is:", type: "mcq", correct: 1, answer: "B", options: ["Wrong variable name", "An unhandled null/empty case", "Missing semicolon", "Incorrect indentation"] },
    { q: "Accepting all 5 suggestions with zero edits shows strong prompt-writing skill.", type: "tf", correct: false, answer: "False: it is a signal to intervene." },
    { q: "Describe the accept habit modeled today in one sentence.", type: "short", keywords: ["read", "decide"], answer: "Accept, read it back, then decide." },
  ],
  4: [
    { q: "Which slash command explains code or errors without changing anything?", type: "mcq", correct: 1, answer: "B", options: ["/fix", "/explain", "/tests", "/deploy"] },
    { q: "QA should apply the fix once they have diagnosed a failing test.", type: "tf", correct: false, answer: "False: QA hands off the diagnosis, Dev fixes and hands back." },
    { q: "What should you paste into Chat instead of a paraphrase?", type: "short", keywords: ["stack trace", "full", "exact error"], answer: "The full stack trace (exact error text)." },
  ],
  5: [
    { q: "Which words should be avoided in a Requirements section because they are too vague?", type: "short", keywords: ["good", "better", "modern"], answer: "\"good\", \"better\", \"modern\": replace with specifics." },
    { q: "List the four sections of the prompt template.", type: "short", keywords: ["context"], answer: "Context / Task / Requirements / Additional Info." },
  ],
  6: [
    { q: "What question should you ask about a generated docstring?", type: "short", keywords: ["should do", "actually", "what the code does"], answer: "Does it describe what the code does, or what it should do?" },
    { q: "A docstring that only covers the happy path is fine if it is well written.", type: "tf", correct: false, answer: "False: the most common failure mode." },
  ],
  7: [
    { q: "Which single word, used alone, means nothing to a reviewer as test evidence?", type: "short", keywords: ["tested"], answer: "\"Tested\" with no detail." },
    { q: "A well-written bug report that cannot be reproduced has still succeeded.", type: "tf", correct: false, answer: "False: it has failed at its one job." },
  ],
  8: [
    { q: "Unfamiliarity with a language means you should trust Copilot's output more.", type: "tf", correct: false, answer: "False: unfamiliarity needs MORE scrutiny." },
    { q: "If you cannot verify generated code is correct, what should you do?", type: "short", keywords: ["say", "flag", "state", "note", "reflection"], answer: "Say so explicitly in the reflection or handoff." },
  ],
  9: [
    { q: "Which should NEVER be pasted into a Copilot prompt?", type: "mcq", correct: 1, answer: "B", options: ["A public API's documented endpoint list", "Real customer PII or credentials", "A generic coding style guide", "An open-source license name"] },
    { q: "A hardcoded secret in Copilot-generated code is automatically flagged and blocked.", type: "tf", correct: false, answer: "False: humans must review for it." },
    { q: "Which is NOT one of the four security-checklist items?", type: "mcq", correct: 2, answer: "C", options: ["Hardcoded secrets", "Missing input validation", "Code formatting style", "Weak crypto defaults"] },
    { q: "Name two things you should never paste into a Copilot prompt.", type: "short", keywords: ["secret", "credential", "pii", "password", "proprietary", "confidential"], answer: "Any two of: secrets/credentials, customer PII, proprietary algorithms, confidential business data." },
    { q: "A confident-looking snippet cannot hide a hardcoded secret.", type: "tf", correct: false, answer: "False: read every line." },
    { q: "Copilot suggesting code that resembles licensed third-party code is which risk?", type: "mcq", correct: 1, answer: "B", options: ["Data leakage risk", "IP/licensing risk", "Performance risk", "Availability risk"] },
    { q: "What is the minimum passing score on this written test?", type: "short", keywords: ["70"], answer: "70%" },
    { q: "This Day 9 test is a soft reminder and does not affect level completion.", type: "tf", correct: false, answer: "False: it is a hard gate." },
    { q: "You find a red flag in a seeded output. What do you do?", type: "mcq", correct: 1, answer: "B", options: ["Ignore it, it is practice", "Flag it with severity and cross-check the answer key", "Fix it silently", "Wait for the facilitator"] },
    { q: "Where is the full Security Checklist and Do's/Don'ts documented?", type: "short", keywords: ["security considerations", "guide", "core principles"], answer: "The AI Enabled Development Guide's Security Considerations section (and Core Principles)." },
  ],
};
