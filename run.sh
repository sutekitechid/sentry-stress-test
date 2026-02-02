#!/bin/bash

# Default values
WORKERS=10
TARGET_URL="https://staging.lms.civitas.id"

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
    *)
      echo "Unknown parameter: $1"
      echo "Usage: ./run.sh -worker <number> -target <url>"
      echo "Example: ./run.sh -worker 10 -target https://example.com"
      exit 1
      ;;
  esac
done

echo "Running Playwright with $WORKERS workers..."
echo "Target URL: $TARGET_URL"

# Set environment variables and run Playwright
TARGET_URL=$TARGET_URL WORKERS=$WORKERS npx playwright test
