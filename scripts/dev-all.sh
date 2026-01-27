#!/bin/bash

# Start all services in development mode
# Requires: tmux or run in separate terminals

echo "🐾 Starting PetSuite Development Environment"
echo "==========================================="
echo ""

# Check if tmux is available
if command -v tmux &> /dev/null; then
  echo "Starting services in tmux session..."

  # Create new tmux session
  tmux new-session -d -s petsuite

  # Split windows
  tmux split-window -h
  tmux select-pane -t 0
  tmux split-window -v

  # Start backend in pane 0
  tmux select-pane -t 0
  tmux send-keys "cd $(pwd) && pnpm dev:backend" C-m

  # Start frontend in pane 1
  tmux select-pane -t 1
  tmux send-keys "cd $(pwd) && pnpm dev:frontend" C-m

  # Start shared watch mode in pane 2
  tmux select-pane -t 2
  tmux send-keys "cd $(pwd) && pnpm dev:shared" C-m

  # Attach to session
  tmux attach-session -t petsuite
else
  echo "⚠️  tmux not found. Starting services sequentially..."
  echo "For best experience, install tmux or run services in separate terminals:"
  echo ""
  echo "Terminal 1: pnpm dev:backend"
  echo "Terminal 2: pnpm dev:frontend"
  echo "Terminal 3: pnpm dev:shared"
  echo ""

  # Start shared in watch mode in background
  pnpm dev:shared &
  SHARED_PID=$!

  echo "Shared package building in background (PID: $SHARED_PID)"
  echo "Press Ctrl+C to stop all services"
  echo ""

  # Trap Ctrl+C to kill all processes
  trap "kill $SHARED_PID; exit" INT

  # Start backend
  pnpm dev:backend
fi
