#!/bin/bash
# Double-click to start your Sponsify team on Telegram (Mac).
# Keep this window open. The Mac stays awake while the team is running.
cd "$(dirname "$0")"
caffeinate -i claude --channels plugin:telegram@claude-plugins-official
