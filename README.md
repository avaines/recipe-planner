# Recipe Vaines - My weekly meal generator

**Recipe Vaines** is an online app that helps you organize your kitchen recipes and generate a monthly menu for your family. It includes a list of all the recipes in your kitchen along with the ingredients required, and helps create a daily tea-time menu so you always know what's for dinner!

The app is built with **Vue 3**, hosted on **Firebase**, and uses **Firestore** for database management.

---

## Features

- **Recipe List**: Store and manage a collection of recipes with ingredients.
- **Ingredient Tracking**: Keep track of ingredients required for each recipe.
- **Monthly Menu**: Automatically generate a monthly menu based on your available recipes.
- **Family Meal Planning**: Simplify your family's meal planning with daily dinner suggestions.

---

## How It Works

1. **Add Recipes**: Each recipe includes a title, description, ingredients, and preparation instructions.
2. **Generate Menu**: The app can automatically generate a menu for each day of the month by selecting recipes from your list.
3. **Ingredient Tracking**: Manage and track the ingredients used in each recipe.

---

## Setup and Development

To set up the project locally and start contributing, follow these steps:

### Prerequisites

- **Node.js** (v22 recommended)
- **npm** (or **yarn**)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/recipe.vaines.org.git
cd recipe.vaines.org
```

### 2. Install Dependencies

Run the following command to install the necessary dependencies for the project:

```bash
npm install
```

or if you prefer using `yarn`:

```bash
yarn install
```

### 3. Firebase Setup

The project uses **Firebase** for hosting and database management (Firestore). You'll need to set up Firebase to run the app locally.

1. **Install Firebase CLI** (if not already installed):

    ```bash
    npm install -g firebase-tools
    ```

2. **Login to Firebase**:

    ```bash
    firebase login
    ```

3. **Setup Firebase**:
    Run the following command to initialize Firebase and set up your project:

    ```bash
    firebase init
    ```

    Choose the following during initialization:
    - Firestore for the database
    - Firebase Hosting for deployment

4. **Configure Firebase Emulator (Optional for Local Development)**:
    You can run Firebase emulators for local development:

```bash
firebase emulators:start --only firestore,auth --import=firebase/dev-data --export-on-exit
# Or use the npm script
npm run emulate
```

### 5. Start the Development Server

Once everything is set up, run the following command to start the local development server:

```bash
npm run serve
```

This will start the Vue.js app locally at `http://localhost:8080`.

### 6. Build for Production

To build the project for production, run:

```bash
npm run build
```

This will generate the production-ready files in the `dist/` folder. These files can then be deployed to Firebase Hosting.

### 7. Download Production Firestore Data

To download the production Firestore database and use it in the local Firebase emulator, run the following script:

```bash
./scripts/downloadFirestoreData.sh
```

---

## Firebase Hosting and Deployment

The app is deployed to **Firebase Hosting** under the domain `recipe.vaines.org`. If you have made changes locally and want to deploy them to Firebase Hosting, follow these steps:

1. **Deploy to Firebase Hosting**:

   ```bash
    firebase deploy --only hosting
   ```

2. After deploying, the app will be live at [https://recipe.vaines.org](https://recipe.vaines.org).

3. **Deploy Firestore rules/indexes manually (when they change)**:

    ```bash
    firebase deploy --only firestore:rules,firestore:indexes
    ```

### GitHub Actions for Deployment

GitHub Actions are set up to automatically deploy the app when changes are pushed to the `main` branch. The workflow also generates preview deployments for pull requests.

---

## Project Structure

Here’s an overview of the project structure:

```text
recipe.vaines.org/
├── .github/
│   └── workflows/
│       ├── main.yml                # GitHub Actions for Firebase live deployment
│       └── preview.yml             # GitHub Actions for PR preview deployments
├── firebase/                       # Firestore rules/indexes and emulator data
├── firebase.json                   # Firebase hosting/emulator configuration
├── public/                         # Static files like images
├── src/                            # Vue.js application code
│   ├── assets/                     # Images and other assets
│   ├── components/                 # Vue components (e.g. RecipeList, MenuPlanner)
│   ├── views/                      # Main views (e.g. Home.vue, RecipeDetails.vue)
│   ├── store.js                    # Vuex store (state management)
│   └── stores/                     # Additional reactive stores
├── package.json                    # NPM dependencies and scripts
└── README.md                       # Project documentation
```

---

## Firestore Database Structure

Here’s an overview of the project Firestore table structure:

### Collection: 'allow-users'

Stores the IDs of valid users, its very lazy but works sufficiently to gatekeep this currently given its only me and my partner who need access

| Document | Fields |
| -------- | ------- |
| *Firebase Authentication Identifier*  | displayName: 'my user',<br>email:'myuser@domain.com',<br>enabled:true,<br>,groupId:'{uuid}' |

### Collection: 'recipes-${groupId}'

The groupID is a UUID assigned to each user at registration
to support sharing/collaboration a user can change their groupId to match someone elses when shared allowing two or more to share the same set of recipies in the collection
Stores the recipe data

| Document | Fields |
| -------- | ------- |
| *Id* | *book*: "title",<br>*ingredients*: "comma,seperated,list",<br>*leftovers*: true/false,<br>*timeConsuming*: true/false,<br>*marinateRequired*: true/false,<br>*glutenFree*: true/false,<br>*recipe*: "name" |
| *Id* | *book*: "title",<br>*ingredients*: "comma,seperated,list",<br>*leftovers*: true/false,<br>*timeConsuming*: true/false,<br>*marinateRequired*: true/false,<br>*glutenFree*: true/false,<br>*recipe*: "name" |

### Collection: 'menus-${groupId}'

Stores the latest saved menu JSON blob for a group.

| Document | Fields |
| -------- | ------- |
| `current` | `groupId: "{uuid}"`,<br>`menuBlob: { ... }`,<br>`updatedAt: Timestamp` |

---

## Environment Variables

For local development, you may need to set the following environment variables in a `.env` file:

- **VUE_APP_FIREBASE_PROJECT_ID**: Your Firebase project ID
- **VUE_APP_FIREBASE_API_KEY**: Firebase Web API key (used for public Firestore REST URL generation)
- **VUE_APP_FIRESTORE_EMULATOR_HOST** (optional): Firestore emulator host/port for local links (default `localhost:9086`)

For CI/deploy, set Firebase secrets in GitHub Actions (for example, `FIREBASE_SERVICE_ACCOUNT` and the required `VUE_APP_FIREBASE_*` values used at build time).

---

## Contributing

See the [CONTRIBUTING.md](CONTRIBUTING) file for details.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Let me know if you need any additional modifications or explanations.
