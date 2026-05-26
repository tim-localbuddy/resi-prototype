#!/bin/bash

# Ensure you are logged in and have the correct project selected
gcloud auth login
gcloud config set project prj-p-bofast

PROJECT_ID="prj-p-bofast"
BUCKET="bofast-documents"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SEED_DIR="./data/seed"

echo "Cleaning old data..."
rm -rf $SEED_DIR
mkdir -p $SEED_DIR/firestore
mkdir -p $SEED_DIR/auth

echo "Exporting Firestore from Cloud..."
gcloud firestore export gs://$BUCKET/emulators/$TIMESTAMP --project $PROJECT_ID

echo "Downloading Firestore data..."
# Use asterisk to copy contents, not the folder itself
gsutil -o "GSUtil:parallel_process_count=1" -m cp -r gs://$BUCKET/emulators/$TIMESTAMP/* $SEED_DIR/firestore/

# Rename the timestamped metadata file to the standard name expected by the emulator
mv $SEED_DIR/firestore/*.overall_export_metadata $SEED_DIR/firestore/firestore.overall_export_metadata

echo "Exporting Auth from Cloud..."
# The emulator expects the file to be inside the auth directory
firebase auth:export $SEED_DIR/auth/accounts.json --project $PROJECT_ID

echo "Generating firebase-export-metadata.json..."
cat <<EOF > $SEED_DIR/firebase-export-metadata.json
{
  "version": "15.15.0",
  "firestore": {
    "path": "firestore",
    "metadata_file": "firestore/firestore.overall_export_metadata"
  },
  "auth": {
    "path": "auth"
  }
}
EOF

echo "Syncing Storage..."
# Run your existing storage sync logic if any
# node scripts/sync-storage.cjs

echo "Done!"