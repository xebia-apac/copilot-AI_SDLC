# Exercise 01 — Installing Your IDE & GitHub Copilot

**Duration**: Approximately 5 minutes in a preconfigured environment
**Copilot Feature**: GitHub Copilot setup, inline suggestions, and Chat Participants
**Goal**: Install a supported IDE, set up GitHub Copilot, verify Chat and inline suggestions, and learn how chat participants work.

---

## Background

**GitHub Copilot** is an AI-powered coding assistant that offers inline code completions and a chat interface. It is available to individual developers, teams, enterprises, and students via GitHub accounts with an active subscription or free trial.

**What you need:**
- GitHub account ([github.com/signup](https://github.com/signup))
- Active Copilot subscription or free trial
- Supported IDE (VS Code recommended)
- Internet access for installation and sign-in
---

## Step 1 — Install Visual Studio Code

**Action**

1. Go to [https://code.visualstudio.com](https://code.visualstudio.com) and download the installer for your operating system (Windows / macOS / Linux).
2. Run the installer and follow the on-screen instructions.
3. Launch VS Code.

**Expected result**

VS Code opens successfully.

> **Already installed?** Check `Help → About` and use a current supported VS Code release. Menu names and Copilot features can vary by version.

---

## Step 2 — Verify GitHub Copilot Chat

GitHub Copilot Chat must be available in VS Code before continuing.

| Extension | Purpose |
|-----------|---------|
| **GitHub Copilot Chat** | Chat panel and inline chat |

**Action**

1. Open **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **GitHub Copilot Chat** from publisher **GitHub**.
3. If it is already installed, continue. Otherwise, install it and reload VS Code if prompted.

**Expected result**

The Copilot Chat view or Chat icon is available in VS Code. The exact extension presentation and UI labels may vary by VS Code release.

---

## Step 3 — Sign In and Verify Access

**Action**

1. Use the Copilot status control if it is visible, or open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for the available Copilot sign-in command.
2. Complete the browser authorization with the GitHub account that has an active Copilot subscription or trial.
3. Return to VS Code and check the Copilot status control or Chat view.

**Expected result**

Copilot Chat is available without an authentication or license error. If access is denied, verify that the signed-in GitHub account has an active Copilot subscription or trial, or that an organization administrator has enabled Copilot for the account. Visit [github.com/features/copilot](https://github.com/features/copilot) if you need to activate a trial.

---

## Step 4 — Verify the Setup

**Action**

1. Open or create an editable file and begin typing a short sentence or code comment, for example: `This project helps teams`.
2. Wait for an inline suggestion. If one appears, press **Tab** to accept it.
3. Open Copilot Chat using the Chat icon. If the icon is not visible, use the configured Chat shortcut (`Ctrl+Alt+I` / `Cmd+Option+I`) or search for Chat in the Command Palette.
4. Type `Hello!` and send the message.

**Expected result**

An inline suggestion can be displayed and accepted, and Copilot Chat returns a response. Suggestions can vary by file type, context, model, and Copilot availability.

---

## Step 5 — Understand Data Flow and Chat Participants

This mini activity is designed for a fresh setup, even if you have no project files yet.

**Action**

1. Open Copilot Chat using the Chat icon, the configured Chat shortcut, or the Command Palette.
2. Try `@vscode` with this prompt:
   `@vscode How do I split the editor into two side-by-side panes?`
3. Open the integrated terminal (`Ctrl+~`) and run a simple command:
   - Windows: `get-Date`
   - macOS/Linux: `date`
4. Keep the terminal open so its output is available as context.
5. Ask `@terminal`:
   `@terminal Explain the last command output in simple words.`

**Expected result**

`@vscode` explains a VS Code action, and `@terminal` explains the visible terminal output. Participant names and availability depend on the installed VS Code and Copilot version. If `@vscode` or `@terminal` is unavailable, ask the same question in regular Chat and attach or select the relevant editor or terminal context when the UI provides that option.

### What to Notice

- `@vscode` explains IDE usage and shortcuts.
- `@terminal` explains commands and terminal output.


### Data Flow 

1. You type a prompt.
2. The selected participant receives it.
3. Copilot processes based on that participant's specialty.
4. The response appears in chat.

> Agents are covered later in Exercise 05. This exercise focuses on setup, Chat, inline suggestions, and chat participants.

---

## Key Takeaway

> GitHub Copilot is not just an autocomplete tool — it is an **AI pair programmer** with inline suggestions and a chat interface. The remaining exercises in this workshop build on top of each other to show you how to use it across the full software development lifecycle.

---

**Next**: [Exercise 02 — Working with GitHub Copilot: Chat Participants](exercise-02-chat-participants.md)
