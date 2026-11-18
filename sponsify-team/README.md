# Your Sponsify AI team on Telegram

Four AI agents you talk to from Telegram. They run on **your computer** and use **your Claude subscription**, so there's no extra cost.

| | Agent | Ask for |
|---|---|---|
| 👑 | **Atlas**, manager | full briefs: he splits the work, checks it and sends one package |
| 🧭 | **Nova**, strategy + research | competitors, market, offers, funnels, campaign plans |
| ✍️ | **Hook**, copy + creative | ads, hooks, captions, scripts, emails, creative reviews (send a photo) |
| 📊 | **Lens**, ads + reports | campaign setups, budgets, test plans, content calendars, reports |

**How to talk to them on Telegram**
- `Atlas, Ramadan campaign for Kaza Store, 10k QAR, goal: sales` → the whole team works
- `Hook, 5 Arabic hooks for a Doha gym` → only Hook works
- `Lens, here are yesterday's numbers: ...` → a report with the next 3 actions
- Send a photo of an ad → Hook reviews it

The team never launches, edits or spends on ads until you write **"yes, launch"**.

---

## One-time setup (about 10 minutes)

You need: a Mac or Windows computer, your Claude subscription, and your Telegram bot token from @BotFather.

### 1. Install Claude Code
Open **Terminal** (Mac) or **PowerShell** (Windows) and paste:

- Mac: `curl -fsSL https://claude.ai/install.sh | bash`
- Windows: `irm https://claude.ai/install.ps1 | iex`

### 2. Install Bun (the Telegram connector needs it)
- Mac: `curl -fsSL https://bun.sh/install | bash`
- Windows: `powershell -c "irm bun.sh/install.ps1 | iex"`

Close and reopen Terminal / PowerShell after this step.

### 3. Get this folder
Download this ZIP, unzip it, and move the `sponsify-team` folder into your **Documents**:
https://github.com/alieeb/sponsify/archive/refs/heads/claude/telegram-bot-token-3jinlm.zip

### 4. Connect Telegram
In Terminal / PowerShell, go into the folder and start Claude:

```
cd ~/Documents/sponsify-team
claude
```

Log in with your Claude account if it asks. When it asks **"Do you trust the files in this folder?"**, choose **Yes** (this lets the team work without asking you for permission every time). Then type these one by one inside Claude:

```
/plugin install telegram@claude-plugins-official
/telegram:configure PASTE_YOUR_BOT_TOKEN_HERE
```

(If it asks for a scope, choose **user**.) Then type `/exit`.

### 5. Start the team
- Mac: double-click **start-team-mac.command** (first time: right-click → Open)
- Windows: double-click **start-team-windows.bat**

If double-clicking doesn't work, paste this in Terminal / PowerShell instead:
```
cd ~/Documents/sponsify-team
claude --channels plugin:telegram@claude-plugins-official
```

### 6. Pair your Telegram (once)
Send any message to your bot on Telegram. It replies with a code. In the Claude window, type:

```
/telegram:access pair THE_CODE
/telegram:access policy allowlist
```

Now only you can talk to your team. ✅

The first time the team replies, Claude may ask permission to use Telegram: choose **"Yes, and don't ask again"**.

---

## Every day
1. Double-click the start file (step 5) and leave the window open.
2. Talk to your team on Telegram.

If the computer sleeps or the window closes, the team stops answering until you start it again. On Windows, set **Settings → System → Power → Sleep: Never** (when plugged in).

## Teach the team your clients
Copy `clients/_template.md` for each client (for example `clients/kaza-store.md`) and fill it in. Or just tell Atlas on Telegram: *"Save this about Kaza Store: ..."* and the team adds it. Long work is saved in `deliverables/`.

## Notes
- Uses Claude Code **Channels**, an official feature that's still in preview, so the steps may change slightly: https://code.claude.com/docs/en/channels
- One Telegram bot can only be connected to one thing. If you later switch on the website-leads bot (`telegram-bot/`), create a second bot in @BotFather for it.
- The team can't run shell commands on your computer. It can only search the web and write in `clients/` and `deliverables/`.
