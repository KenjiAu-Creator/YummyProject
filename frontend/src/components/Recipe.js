import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useParams} from "react-router";

function Recipe(){

  const [myRecipe, setMyRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const {recipes} = useParams();

  useEffect(() => {
    fetchRecipe();
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps


  async function fetchRecipe(){
    const response = await axios.get(`api/recipes/${recipes}`);
    setMyRecipe(response.data);
    setLoading(false);
  }

  {/* TODO: Design better loading display. Perhaps a loading gif of some sort? */}
  if (loading){
    return(
      <>
        {/* TODO: Remove center tags and apply centering via CSS */}
        <center>
        <p><i className="fas fa-spinner fa-spin fa-4x"></i></p>
          <p>Loading your recipe...</p></center>
      </>
    )
  }

  return(
    <>
      {/* TODO: change to myRecipe.image once images are stored in DB. Placeholder image used for now for styling */}
      <p><img src={"https://designshack.net/wp-content/uploads/placehold.jpg"} alt={myRecipe.name}/></p>
      <h1>{myRecipe.name}</h1>
      <h4>Servings: {myRecipe.servings}</h4>
      <h4>Prep Time: {myRecipe.prepTime}</h4>

      <h4>Ingredients:</h4>
      {/* TODO: Render each ingredient in myRecipe.ingredients array outputting a line formatted like below */}
      <p>{myRecipe.ingredients[0].name} - {myRecipe.ingredients[0].quantity}{myRecipe.ingredients[0].uomId}</p>
      <p>{myRecipe.ingredients[1].name} - {myRecipe.ingredients[1].quantity}{myRecipe.ingredients[1].uomId}</p>
      <p>{myRecipe.ingredients[2].name} - {myRecipe.ingredients[2].quantity}{myRecipe.ingredients[2].uomId}</p>
      {/*TODO: Loop through below and display like above for each line.}
      <p>Stringify Stuff:</p>
      <p>{JSON.stringify(myRecipe.ingredients)}</p>{*/}

      <h4>Macros:</h4>
      <p>Calories: {myRecipe.calories}</p>
      <p>Fat: {myRecipe.fat}g</p>
      <p>Protein: {myRecipe.protein}g</p>
      <p>Carbs: {myRecipe.carbohydrates}g</p>

      <h4>Instructions</h4>
      <p>{myRecipe.instructions}</p>


      <h4>Notes:</h4>
      <p>{myRecipe.notes}</p>

      {/* TODO: Consult; perhaps this could link to a page identical to "Create" but with all the fields filled in and ready to edit? Potential better ways to handle edit page? */}
      {/* TODO: Button Functionality */}
      <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow" type="submit">
        Edit Recipe
      </button>
      <Link to={"/recipes/"}><button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow" type="submit">
        Return to Recipe List
      </button></Link>
    </>
  );
}

export default Recipe;
