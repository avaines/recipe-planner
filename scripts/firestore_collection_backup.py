"""
Firestore Collection Backup and Restore Script

This script allows you to backup and restore Firestore collections. It supports two modes:
- backup: Backs up specified collections or all collections to a specified directory.
- restore: Restores specified collections from a specified directory.

Usage:
    python firestore_collection_backup.py <mode> --collections <collection_names> --dir <directory> --cred <credential_path>

Arguments:
    mode: The mode to run the script in. Can be 'backup' or 'restore'.
    --collections: Names of the collections to backup or restore. If not specified, all collections will be backed up. Multiple collections can be backed up by separating names by space
    --dir: Directory to save backups or read restores from. Defaults to './backup'.
    --cred: Path to the Firebase credential certificate. This argument is required.

Example:
    python firestore_collection_backup.py backup --collections users orders --dir ./backup --cred path/to/credential.json
    python firestore_collection_backup.py restore --collections users orders --dir ./backup --cred path/to/credential.json
"""
import argparse
import json
import os
import firebase_admin
from firebase_admin import credentials, firestore


def backup_collection(collection_name, output_dir):
    db = firestore.client()
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()

    data = {}
    for doc in docs:
        data[doc.id] = doc.to_dict()

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(os.path.join(output_dir, f"{collection_name}.json"), 'w') as f:
        json.dump(data, f, indent=4)
    print(f"Backup of collection '{collection_name}' completed.")


def restore_collection(collection_name, input_dir):
    db = firestore.client()
    collection_ref = db.collection(collection_name)

    with open(os.path.join(input_dir, f"{collection_name}.json"), 'r') as f:
        data = json.load(f)

    for doc_id, doc_data in data.items():
        collection_ref.document(doc_id).set(doc_data)
    print(f"Restore of collection '{collection_name}' completed.")


def backup_all_collections(output_dir):
    db = firestore.client()
    collections = db.collections()

    for collection in collections:
        backup_collection(collection.id, output_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Backup or restore Firestore collections.")
    parser.add_argument('mode', choices=['backup', 'restore'], help="Mode to run the script in: backup or restore")
    parser.add_argument('--collections', nargs='*', help="Names of the collections to backup or restore")
    parser.add_argument('--dir', '-d', default='./firestore-manual-backup', help="Directory to save backups or read restores from")
    parser.add_argument('--cred', '-c', required=True, help="Path to the Firebase credential certificate")

    args = parser.parse_args()

    cred = credentials.Certificate(args.cred)
    firebase_admin.initialize_app(cred)

    if args.mode == 'backup':
        if args.collections:
            for collection_name in args.collections:
                backup_collection(collection_name, args.dir)
        else:
            backup_all_collections(args.dir)

    elif args.mode == 'restore':
        if args.collections:
            for collection_name in args.collections:
                restore_collection(collection_name, args.dir)
        else:
            print("Please specify collections to restore using --collections")
    else:
        print("Invalid mode. Use 'backup' or 'restore'.")
