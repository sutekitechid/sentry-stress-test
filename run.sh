#!/bin/bash

# Default values
WORKERS=10
TARGET_URL="https://staging.lms.civitas.id"
DURATION=3000

# Parse named parameters
while [[ $# -gt 0 ]]; do
  case $1 in
    -worker|--worker)
      WORKERS="$2"
      shift 2
      ;;
    -target|--target)
      TARGET_URL="$2"
      shift 2
      ;;
    -duration|--duration)
      DURATION="$2"
      shift 2
      ;;
    *)
      echo "Unknown parameter: $1"
      echo "Usage: ./run.sh -worker <number> -target <url> -duration <milliseconds>"
      echo "Example: ./run.sh -worker 10 -target https://example.com -duration 5000"
      exit 1
      ;;
  esac
done

echo "Running Playwright with $WORKERS workers..."
echo "Target URL: $TARGET_URL"
echo "Duration: $DURATION ms"

# Set environment variables and run Playwright
TARGET_URL=$TARGET_URL WORKERS=$WORKERS DURATION=$DURATION npx playwright test
