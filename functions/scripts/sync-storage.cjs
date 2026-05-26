const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

const BUCKET_NAME = 'bofast-documents';

// 1. Setup Cloud Storage (Bypassing Firebase Admin to ignore emulator env var)
const cloudStorage = new Storage({
  keyFilename: path.join(__dirname, "../.secrets", "service-account.json")
});
const cloudBucket = cloudStorage.bucket(BUCKET_NAME);

// 2. Setup Local App (Emulator)
process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
const localApp = admin.initializeApp({
  projectId: 'prj-p-bofast',
  storageBucket: BUCKET_NAME
}, 'local');

async function syncStorage() {
  const localBucket = localApp.storage().bucket();

  console.log('Fetching files from Cloud...');
  const [files] = await cloudBucket.getFiles();

  console.log(`Found ${files.length} files. Starting sync...`);

  for (const file of files) {
    console.log(`Copying: ${file.name}`);

    // Download from Cloud into memory
    const [content] = await file.download();

    // Preserve metadata (Content-Type, etc.)
    const metadata = {
      contentType: file.metadata.contentType,
      metadata: file.metadata.metadata, // Custom metadata
    };

    // Upload to Local Emulator
    await localBucket.file(file.name).save(content, {
      metadata: metadata,
      resumable: false
    });
  }

  console.log('✅ Storage Sync Complete!');
  process.exit();
}

syncStorage().catch(console.error);