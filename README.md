# Recipe Vaines - My weekly meal generator

**Recipe Vaines** is an online app that helps you organize your kitchen recipes and generate a monthly menu for your family. It includes a list of all the recipes in your kitchen along with the ingredients required, and helps create a daily tea-time menu so you always know what's for dinner!

The app is built with **Vue.js 2**, hosted on **Firebase**, and utilizes **Firestore** for database management.

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

- **Node.js** (v16+ recommended)
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
    - Functions (optional, if you need backend functions)

4. **Configure Firebase Emulator (Optional for Local Development)**:
    You can run Firebase emulators for local development:

    ```bash
    firebase emulators:start
    ```

### 4. Start the Development Server

Once everything is set up, run the following command to start the local development server:

```bash
npm run serve
```

or if you are using `yarn`:

```bash
yarn serve
```

This will start the Vue.js app locally at `http://localhost:8080`.

### 5. Build for Production

To build the project for production, run:

```bash
npm run build
```

This will generate the production-ready files in the `dist/` folder. These files can then be deployed to Firebase Hosting.

### 5. Download Production Firestore Data

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

### GitHub Actions for Deployment

GitHub Actions are set up to automatically deploy the app when changes are pushed to the `main` branch. The workflow also generates preview deployments for pull requests.

---

## Project Structure

Here’s an overview of the project structure:

```
recipe.vaines.org/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # GitHub Actions for Firebase deployment
│       └── preview.yml             # GitHub Actions for PR preview deployments
├── firebase/                       # Firebase project configurations
│   └── firebase.json               # Firebase configuration file
├── public/                         # Static files like images
├── src/                            # Vue.js application code
│   ├── assets/                     # Images and other assets
│   ├── components/                 # Vue components (e.g. RecipeList, MenuPlanner)
│   ├── views/                      # Main views (e.g. Home.vue, RecipeDetails.vue)
│   └── store/                      # Vuex store (state management)
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
| *Firebase Authentication Identifier*  | note: 'my user' |

### Collection: 'recipies'
Stores the recipe data

| Document | Fields |
| -------- | ------- |
| *Id* | *book*: "title",<br>*ingredients*: "comma,seperated,list",<br>*lunch*: true/false,<br>*recipe*: "name" |
| *Id* | *book*: "title",<br>*ingredients*: "comma,seperated,list",<br>*lunch*: true/false,<br>*recipe*: "name" |


---

## Environment Variables

For local development, you may need to set the following environment variables in a `.env` file:

- **FIREBASE_PROJECT_ID**: Your Firebase project ID
- **FIREBASE_TOKEN**: Firebase CI token for deployments

You can obtain the **FIREBASE_TOKEN** by running:

```bash
firebase login:ci
```

Then store it in your GitHub repository secrets for automated deployment.

---

## Contributing

We welcome contributions! To contribute to the project:

1. Fork the repository and create your branch.
2. Make your changes and test locally.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [Vue.js](https://vuejs.org) – JavaScript framework used for the front end.
- [Firebase](https://firebase.google.com) – Platform for backend services (Firestore, Hosting, Authentication).
- [GitHub Actions](https://github.com/features/actions) – For CI/CD automation.

---

Let me know if you need any additional modifications or explanations.