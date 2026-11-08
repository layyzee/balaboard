#!/usr/bin/env bash
# Stop BalaBoard (Kills both Vite Frontend & Sync Server)

echo "Stopping BalaBoard..."

# Kill port 5175 (Vite)
PID_5175=$(lsof -ti :5175)
if [ -n "$PID_5175" ]; then
  kill -9 $PID_5175
  echo "✓ Stopped Vite frontend (killed PID $PID_5175)."
else
  echo "• Port 5175 (Vite) was not active."
fi

# Kill port 5176 (Sync Server)
PID_5176=$(lsof -ti :5176)
if [ -n "$PID_5176" ]; then
  kill -9 $PID_5176
  echo "✓ Stopped WebSocket sync server (killed PID $PID_5176)."
else
  echo "• Port 5176 (WebSocket) was not active."
fi

echo "All BalaBoard services stopped."
