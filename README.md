# ryan-recipes

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Coding Challenge

### Recipe Website Coding Challenge

Build a React.js/Vue.js application that allows users to search for recipes using the Spoonacular API. The code and application should be publicly available (e.g., GitHub repository and/or GitHub Pages).

#### Requirements

The website/application should include the following pages:

#### Home Page

- **Features**:
  - Search input field.
  - Search button.
  - Search results with pagination (5 results per page) and the ability to filter by cuisine.
- **Search Results**:
  - Display the following information for each recipe:
    - Recipe Name.
    - Recipe Image.
  - When the user presses the Enter key or clicks the search button, the search results are displayed.
  - Clicking on a recipe redirects the user to the Recipe Detail Page.

#### Recipe Detail Page

- **Features**:
  - Display the following information:
    - Recipe Name.
    - Recipe Image.
    - Health Information (e.g., vegan, dairy-free).
    - List of ingredients.
    - Cooking instructions.
  - For each ingredient, display:
    - Ingredient Name.
    - Ingredient Measure.

#### API Documentation

- **Authentication**: [Spoonacular Authentication](https://spoonacular.com/food-api/docs#Authentication)
- **Search Recipes**: [Search Recipes API](https://spoonacular.com/food-api/docs#Search-Recipes-Complex)
- **Get Recipe Information**: [Get Recipe API](https://spoonacular.com/food-api/docs#Get-Recipe-Information)
- **Supported Cuisines**: [Supported Cuisines API](https://spoonacular.com/food-api/docs#Cuisines)
