import argparse
import firebase_admin
from firebase_admin import credentials, firestore

def update_collection(collection_name):
    db = firestore.client()
    collection_ref = db.collection(collection_name)
    docs = collection_ref.stream()

    for doc in docs:
        doc_dict = doc.to_dict()
        if 'lunch' in doc_dict:
            doc_dict['leftovers'] = doc_dict.pop('lunch')
            collection_ref.document(doc.id).set(doc_dict)
            print(f"Updated document {doc.id} in collection {collection_name}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--collections', nargs='*', help="Names of the collection")
    parser.add_argument('--cred', '-c', required=True, help="Path to the Firebase credential certificate")

    args = parser.parse_args()

    cred = credentials.Certificate(args.cred)
    firebase_admin.initialize_app(cred)

    for collection in args.collections:
        update_collection(collection)
