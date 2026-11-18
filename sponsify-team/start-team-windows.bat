@echo off
REM Double-click to start your Sponsify team on Telegram (Windows).
REM Keep this window open while you use the team.
cd /d "%~dp0"
claude --channels plugin:telegram@claude-plugins-official
pause
