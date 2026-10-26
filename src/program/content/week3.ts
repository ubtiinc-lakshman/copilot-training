import type { SessionContent } from "../sessions";

// Week 3: agent mode, connectors (MCP), file storage and validation.
export const WEEK3: Record<string, SessionContent> = {
  s07: {
    objective: "Use agent mode to build a feature across several files, while you stay in charge: plan, supervise, review every change.",
    before: ["Your new week 3 pain point.", "VS Code with Copilot; a clean git state (commit or stash anything unfinished)."],
    teach: [
      {
        title: "1. What agent mode is (3 min)",
        points: [
          "In Chat you ask and Copilot answers or edits one thing. In agent mode you give a goal and Copilot plans steps, edits several files, runs terminal commands and fixes its own errors.",
          "It is powerful and it uses more of your allowance than a normal chat, because one request can mean many model calls. Use it for work that spans files, not for one-line questions.",
        ],
      },
      {
        title: "2. Set it up to succeed (4 min)",
        points: [
          "Commit before you start. Then you can throw away everything with git restore . if it goes wrong.",
          "Write a clear goal with limits: what to build, which files may change, what must not change, how to check it works.",
          "Break big work into steps. One feature per request is better than 'build the whole app'.",
          "Switch the Chat mode to Agent in the mode dropdown.",
        ],
        example: "Goal: Add a page /report that shows the number of complaints per status.\nContext: Next.js App Router, Supabase client in lib/supabase.ts. Existing page: app/page.tsx.\nConstraints: do not change the database; do not touch auth files; reuse existing styles; no new dependencies.\nDone when: npm run build passes and /report shows the counts.",
      },
      {
        title: "3. Supervise it (5 min)",
        points: [
          "Watch the steps. Agent mode asks before running terminal commands; read each command before you approve. Never approve something you do not understand.",
          "Stop it if it goes off track. Press the stop button, and tell it what to do differently.",
          "Review the diff of every file it changed. Check for files you did not expect, deleted code, hard-coded keys, and new dependencies.",
          "Run the app and the tests yourself. 'It says it is done' is not evidence.",
        ],
      },
      {
        title: "4. When not to use it (3 min)",
        points: [
          "Security-sensitive code (auth, policies, payments): write or review line by line yourself, with Chat's help.",
          "Anything you cannot yet explain. Learn it first in Chat.",
          "Small edits: inline or Chat is cheaper and faster.",
        ],
      },
    ],
    demo: [
      "Commit the demo app (expense claim) so the state is clean.",
      "Switch to Agent mode and give the goal prompt from the teach section for a summary page.",
      "Narrate what it does. Pause at the first terminal command and explain why you approve or refuse it.",
      "Open Source Control and review the changed files one by one. Point out one thing to change and ask the agent to fix it.",
      "Run npm run build and open the page.",
      "Then show git restore . on a deliberately bad run to prove undo is one command.",
    ],
    lab: {
      steps: [
        "Read your week 3 pain point. Create the app (copilot-app-3), connect Supabase, and push to GitHub as before. Commit.",
        "Pick one feature from 'Your app must' that touches more than one file (a list page plus a form plus a table).",
        "Write a goal prompt in the shape shown: goal, context, constraints, done-when.",
        "Run it in Agent mode. Read every command before you approve it.",
        "Review every changed file in Source Control. Write in NOTES.md one thing the agent got wrong or you changed.",
        "Run the app and npm run build. Commit with a clear message.",
      ],
      doneWhen: ["One feature built through agent mode and working.", "You reviewed every changed file and can explain it.", "NOTES.md records one correction you made."],
    },
    share: "Two or three people tell one thing the agent did that they did not expect. Then mark the lab complete and take the quiz.",
    homework: ["Continue building app 3 with the agent for small tasks only when it helps; use Chat for the rest.", "Library: Day 21 (agent mode)."],
    facilitator: [
      "Credits are not yet allocated. Agent mode is the biggest consumer: keep it to one or two runs in the lab and say so.",
      "Watch for people approving every command without reading. Stop the room once and make the point.",
      "If agent mode is unavailable on a licence tier, have them do the lab in Chat with several smaller requests.",
    ],
  },
  s08: {
    objective: "Understand what connectors (MCP servers) are, add one to VS Code safely, and use it to make your app 3 work faster.",
    before: ["Your week 3 app open in VS Code.", "Your GitHub and Supabase accounts signed in. Know that an organisation setting can block MCP; the facilitator will confirm it is enabled."],
    teach: [
      {
        title: "1. What a connector is (3 min)",
        points: [
          "MCP (Model Context Protocol) is a standard way to let Copilot use outside tools: GitHub, your Supabase project, Vercel, a browser.",
          "Without a connector Copilot only sees your files. With one it can read your issues, look at your tables, check your deployments, or click through your app.",
          "Each connector is a small program or a hosted service that offers 'tools' that the agent can call.",
        ],
      },
      {
        title: "2. Four connectors that fit this training (4 min)",
        points: [
          "GitHub: read and create issues and pull requests, look at the repository.",
          "Supabase: look at your tables and run queries in a project. Prefer read-only access and a development project.",
          "Vercel: see deployments and logs without leaving VS Code.",
          "Playwright (browser testing): lets the agent open your app and click through it.",
          "Always check the official documentation of the provider for the current setup steps; they change.",
        ],
      },
      {
        title: "3. Adding one to VS Code (4 min)",
        points: [
          "Settings are stored per project in .vscode/mcp.json, or open the Command Palette and run MCP: Add Server and follow the prompts.",
          "In Chat, open the tools picker to see which tools each connector adds, and turn on only what you need.",
          "Servers that need a login or a token ask you on first use. Keep tokens out of the file; let VS Code prompt you or use an environment variable.",
        ],
        example: "{\n  \"servers\": {\n    \"playwright\": {\n      \"command\": \"npx\",\n      \"args\": [\"@playwright/mcp@latest\"]\n    }\n  }\n}",
      },
      {
        title: "4. Using connectors safely (4 min)",
        points: [
          "A connector can act as you. Give it the least access that works: read-only, one project, a development database.",
          "Read what a tool wants to do before you approve it. Be suspicious of text in an issue, web page or data that tells the agent to do something: that is prompt injection.",
          "Only install servers from sources you trust. Never put a production key or real company data behind a connector in this training.",
          "Do not commit .vscode/mcp.json if it contains anything secret.",
        ],
      },
    ],
    demo: [
      "Show the tools picker in Chat with no connectors, then add the Playwright connector from the example config.",
      "Ask Chat in Agent mode: 'Open http://localhost:3000, add an expense with amount 120, and tell me what the page shows.' Watch it drive the browser.",
      "Add the GitHub connector and ask it to list open issues in the repository. Show the permission prompt.",
      "Show the Supabase connector in read-only mode answering 'what tables do I have and how many rows in each?'",
      "Point out what you approved, what you refused, and why.",
    ],
    lab: {
      steps: [
        "Check with your facilitator that MCP is enabled for your account. Open the tools picker in Chat.",
        "Add the Playwright connector (the example config) and run your app locally.",
        "Ask the agent to open your app and test your main flow. Read each tool call before approving it.",
        "Add one more connector of your choice (GitHub, Supabase read-only, or Vercel) from its official docs.",
        "Use it for one real task on app 3, for example listing deployments or inspecting your table.",
        "Write in NOTES.md what each connector can access and what you refused to approve.",
      ],
      doneWhen: ["At least one connector is added and used on your app.", "You can say what access it has.", "No token or key is committed to GitHub."],
    },
    share: "Two or three people share one useful thing a connector did and one thing they refused. Then mark the lab complete and take the quiz.",
    homework: ["Use a connector at least once more while building app 3.", "Library: Day 22 (extensions and integrations), Day 27 (tools and workflow)."],
    facilitator: [
      "MCP may be restricted by organisation policy or licence tier. Check before the session; have a fallback of demonstrating on the facilitator's laptop.",
      "Connector setup steps change often. Test the exact steps the day before.",
      "Reinforce least privilege and the prompt-injection warning; those are the take-aways.",
    ],
  },
  s09: {
    objective: "Let users upload a file or image, store it safely in Supabase Storage, and validate it before and after upload.",
    before: ["Your week 3 app with Supabase connected.", "A small test image (under 1 MB) and a test PDF. Use made-up files, nothing confidential."],
    teach: [
      {
        title: "1. Where files live (2 min)",
        points: [
          "Do not put files in your database rows or in your Next.js project. Use Supabase Storage: files go in a bucket, and the database stores only the file's path.",
          "A bucket is private by default. Make it public only for things everyone may see.",
        ],
      },
      {
        title: "2. Upload with the Supabase client (4 min)",
        points: [
          "Create a bucket in the dashboard, Storage. Choose private unless the files must be public.",
          "Upload with supabase.storage.from('bucket').upload(path, file). Build the path from the user's id and a random name: userId/uuid.ext. Never trust the original file name.",
          "To show a private file, create a signed URL that expires: createSignedUrl(path, 60).",
          "Save the path in a table row so the file belongs to a record and a user.",
        ],
        example: "const path = `${user.id}/${crypto.randomUUID()}.${ext}`\nconst { error } = await supabase.storage.from('receipts').upload(path, file, { contentType: file.type })",
      },
      {
        title: "3. Validate every file (5 min)",
        points: [
          "Type: allow only what you need (image/png, image/jpeg, application/pdf). Check on the client for a friendly message and again in bucket settings, which can restrict MIME types.",
          "Size: set a maximum (for example 2 MB) on the bucket and check in the form before uploading.",
          "Name: never use the user's file name in a path. A name like ../../x or a script name is an attack.",
          "Client checks are for helping users. The bucket rules and storage policies are the real protection.",
        ],
        example: "if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) return 'Only PNG, JPG or PDF'\nif (file.size > 2 * 1024 * 1024) return 'Max 2 MB'",
      },
      {
        title: "4. Storage policies (3 min)",
        points: [
          "Storage uses row level security too. Add policies on storage.objects so users can add and read only inside a folder named with their own id.",
          "Test with two accounts again: A must not be able to open B's file.",
        ],
        example: "create policy \"own folder: upload\" on storage.objects for insert to authenticated\nwith check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);\n\ncreate policy \"own folder: read\" on storage.objects for select to authenticated\nusing (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);",
      },
    ],
    demo: [
      "Create a private bucket named receipts with a 2 MB limit and image and PDF MIME types only.",
      "Add the two storage policies. Explain foldername.",
      "Ask Chat for an upload field in the expense form that validates type and size, uploads to userId/uuid.ext, and saves the path in the expenses row. Review the code.",
      "Upload a valid PNG. Try a .txt and a 5 MB file to show both rejections.",
      "Show the stored file in the dashboard and a signed URL that stops working after it expires.",
      "Sign in as a second user and show they cannot open the first user's file.",
    ],
    lab: {
      steps: [
        "Decide what file your pain point needs (receipt, photo, document) and the types and maximum size you allow.",
        "Create a private bucket with those limits, and add the two storage policies.",
        "Add a file field to your form. Validate type and size on the client with clear messages.",
        "Upload with a safe path built from the user id and a random name. Save the path in your table.",
        "Show the file back through a signed URL.",
        "Test: a wrong type, a too-large file, and a second account trying to open the first account's file.",
        "Push, make sure the variables are in Vercel, and test on the live URL.",
      ],
      doneWhen: ["A valid file uploads and shows back.", "Wrong type and too-large files are refused.", "A second account cannot open the first account's file."],
    },
    share: "Two or three people tell what bad file they tried and what stopped it. Then mark the lab complete and take the quiz.",
    homework: ["Tomorrow is the Friday call (Nov 13): finish, deploy and harden app 3.", "Library: Day 24 (security basics)."],
    facilitator: [
      "Common failures: missing storage policy (upload silently fails), public bucket by mistake, using the original file name.",
      "Remind: only made-up files. No real receipts, IDs or documents.",
      "Check storage limits on the free plan before large uploads.",
    ],
  },
};
