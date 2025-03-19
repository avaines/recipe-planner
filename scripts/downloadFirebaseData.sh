#!/bin/bash

# This script automates the process of exporting Firestore data to a Google Cloud Storage (GCS) bucket
# and then downloading it to a local directory. It also checks for required shell utilities and handles
# the starting of Firebase emulators with the imported data.

# Steps:
# 1. Load environment variables from the .env file.
# 2. Check if the export directory exists and is not empty.
# 3. If the directory is not empty, prompt the user to update it or start the emulators without importing.
# 4. Ensure required shell utils are installed.
# 5. Export Firestore data to a GCS bucket.
# 6. Download the exported data from GCS to the local directory.
# 7. Start Firebase emulators with the imported data.


# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

EXPORT_DIR="firestore-backup"
BUCKET_NAME="${VUE_APP_FIREBASE_PROJECT_ID}.appspot.com"


# Check if the export directory exists and is not empty
if [ -d "$EXPORT_DIR" ] && [ "$(ls -A $EXPORT_DIR)" ]; then
  read -p "The export directory already contains data. Do you want to update it first? (y/N): " choice
  case "$choice" in
    y|Y ) echo "Updating the export directory...";;
    n|N ) echo "Starting emulators without importing first."; firebase emulators:start --import ${EXPORT_DIR};;
    * ) echo "Starting emulators without importing first."; firebase emulators:start --import ${EXPORT_DIR};;
  esac
else
  mkdir -p "$EXPORT_DIR"
fi

REQUIRED_SHELL_UTILS=("gsutil" "gcloud" "firebase")
# Check if required commands are available
for util in "${REQUIRED_SHELL_UTILS[@]}"; do
  if ! command -v ${util} &> /dev/null; then
    echo "${util} command not found. Install it first."
    exit 1
  fi
done

# Export Firestore data to a GCS bucket
gcloud firestore export gs://${BUCKET_NAME}/${EXPORT_DIR} --project ${VUE_APP_FIREBASE_PROJECT_ID}

# Use gsutil the exported data from GCS to local directory
if gsutil -m cp -r gs://${BUCKET_NAME}/${EXPORT_DIR} .; then
  firebase emulators:start --import ${EXPORT_DIR}
else
  echo "Failed to download Firestore data."
fi
