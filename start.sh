#!/usr/bin/env bash
# Start BalaBoard (Agile Whiteboard + Real-Time Sync Server)

set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="$HOME/.local/node/bin:/usr/local/bin:$PATH"

echo "=================================================="
echo "🚀 Starting BalaBoard Agile Whiteboard"
echo "   URL: http://localhost:5175"
echo "   LAN: http://192.168.68.102:5175"
echo "   Sync Server: ws://0.0.0.0:5176"
echo "=================================================="

# Check if WebSocket server (port 5176) is running
if ! lsof -ti :5176 >/dev/null 2>&1; then
  echo "• Starting WebSocket Real-Time Sync Server (port 5176)..."
  nohup "$HOME/.local/node/bin/node" "$DIR/server/syncServer.js" > "$DIR/sync-server.log" 2>&1 &
  WS_PID=$!
  disown $WS_PID
  echo "  ✓ Sync server running (PID: $WS_PID)"
else
  echo "• Sync server is already active on port 5176."
fi

# Check if Vite frontend (port 5175) is running
if ! lsof -ti :5175 >/dev/null 2>&1; then
  echo "• Starting Vite Web Frontend (port 5175)..."
  nohup "$HOME/.local/node/bin/npx" vite --port 5175 --host 0.0.0.0 > "$DIR/vite-server.log" 2>&1 &
  VITE_PID=$!
  disown $VITE_PID
  echo "  ✓ Vite frontend running (PID: $VITE_PID)"
else
  echo "• Vite frontend is already active on port 5175."
fi

sleep 1
open "http://localhost:5175"
echo "=================================================="
echo "🎉 BalaBoard is ready for your team retrospective!"
echo "=================================================="
