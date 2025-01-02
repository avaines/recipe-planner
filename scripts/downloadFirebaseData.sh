#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

EXPORT_DIR="firebase/firestore-backup"
BUCKET_NAME="${VUE_APP_FIREBASE_PROJECT_ID}.appspot.com"
REQUIRED_SHELL_UTILS=("gsutil" "gcloud" "firebase")


# Check if the export directory exists and is not empty
if [ -d "$EXPORT_DIR" ] && [ "$(ls -A $EXPORT_DIR)" ]; then
  read -p "The export directory already contains data. Do you want to update it first? (y/n): " choice
  case "$choice" in
    y|Y ) echo "Updating the export directory...";;
    n|N ) echo "Starting emulators without importing first."; firebase emulators:start --import ${EXPORT_DIR};;
    * ) echo "Invalid choice. Aborting."; exit 1;;
  esac
else
  mkdir -p "$EXPORT_DIR"
fi

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
