const cards_container = document.querySelector(".Container_cards_body");



window.onload = function() {
    fetchData();
}


// Check for the existence of the 'localStorage' object
if (typeof(Storage) !== "undefined") {
    if (localStorage.getItem("userRecipe")) {
        userRecipe = JSON.parse(localStorage.getItem("userRecipe"));
    } else {
        // Should display a message to the user that no recipe has been saved
        userRecipe = {};
    }
}




//Create a div to hold the Recipe items
function createRecipeCard(image, title, category) {
    const recipeDiv = document.createElement("div");
    recipeDiv.className = "recipe_card";
    const recipeImage = document.createElement("img");
    recipeImage.src = image;   
    recipeImage.alt = "Recipe Image";
    recipeImage.style.width = '100%';
    recipeImage.style.height = '73%'; 
    recipeImage.style.objectFit = 'cover'
    recipeImage.className = "recipe_image";
    const recipeTitle = document.createElement("h2"); 
    recipeTitle.innerText = title;
    recipeTitle.className = "recipe_title";
    const recipeCategory = document.createElement("p");
    recipeCategory.className = "recipe_category";
    recipeCategory.innerText = "Category: " + category;
    recipeDiv.appendChild(recipeImage);
    recipeDiv.appendChild(recipeTitle);
    recipeDiv.appendChild(recipeCategory);

    // Add an event listener to the recipeDiv to handle clicks
    recipeDiv.addEventListener("click", function() {
        // Call the function to display the recipe details
        // displayRecipeDetails(title, category);
        alert("I have been clicked");
    });
    cards_container.appendChild(recipeDiv);
}




//Cal our Api to get the recipe details
async function fetchData() {
    let query = 'mushroom'
    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + encodeURI(query);
    try {
        const response = await fetch(url
    );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        // Get the response and break it into constituent sections
        const json = await response.json();
        console.log(json);
        if (json.meals === null) {
            console.log("No meals found");
            return;
        } else if(json.meals.length > 1) {
            console.log("More than one meal found");
            mealsArr = json.meals;
            for (meal of mealsArr) {
                let arr =[meal]
                let result = await loopRecipeArray(arr);
                console.log(result[0]['strMeal']);
                console.log(result[0]['strCategory']);
                console.log(result[0]['strMealThumb']);
                createRecipeCard(result[0].strMealThumb, result[0].strMeal, result[0].strCategory);
            }     
        } else {
            let result = await loopRecipeArray(json.meals);
            console.log(result[0]['strMeal']);
            console.log(result[0]['strCategory']);
            console.log(result[0]['strMealThumb']);
            createRecipeCard(result[0].strMealThumb, result[0].strMeal, result[0].strCategory);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}




//We pass the meals array to the loopRecipeArray 
function loopRecipeArray(array) {
    console.log("Array length is" + array.length);
    return array.map(obj => {
        let ingredientArr = [];
        let measureArr = [];
        let {strMeal, strCategory, strInstructions, strMealThumb, strYoutube} = obj;
        for (let i=1; i<=20; i++) {
            let ingredient =obj[`strIngredient${[i]}`];
            let measure = obj[`strMeasure${[i]}`];
            if (ingredient || measure) {
                ingredientArr.push(ingredient);
                measureArr.push(measure);  
            }
        }
        let combinedArr = [];
        measureArr.forEach((measure, index) => {
            if (measureArr[index] && ingredientArr[index]) {
                combinedArr.push(`${measure} ${ingredientArr[index]}`);
            }
        });
        
        let result =  {strMeal, strCategory, strInstructions, strMealThumb, strYoutube, ingredientArr, combinedArr};
        return result;
    })
}












































//Add new line to the recipeInstructions to separate it into different lines
function formatInstructions(instructions) {
    const instructionsArray = instructions.split(".");
    return instructionsArray.map(instruction => `<p>${instruction.trim()}</p>`).join("");
}




// async function fetchData() {
//     let query = 'mushroom'
//     // const url = "https://api.calorieninjas.com/v1/recipe?query=" + encodeURI(query);
//     // const url = "https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2"
//     const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + encodeURI(query);
//     try {
//         const response = await fetch(url
//             // {
//         //     headers: {
//         //         'X-Api-Key': '9MXf7NQhjWLR1MffoJ3VWQ==vYFeX5QKcVvPyWU3',
//         //         "Content-Type": "application/json",
                
//         //     },
//         // }
//     );
//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }

//         // Get the response and break it into constituent sections
//         const json = await response.json();
//         // console.log(json);
//         // let result = await looprecipeArray(json);
//         console.log(json);

//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// }




