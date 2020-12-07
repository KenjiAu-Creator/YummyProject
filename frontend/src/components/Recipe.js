import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm';
import axios from 'axios';
import {useParams} from "react-router";
import { AuthContext } from '../contexts/AuthContext';
import {EditorState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";

function Recipe(){
  const {user} = useContext(AuthContext);

  const [myRecipe, setMyRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const {recipes} = useParams();

  useEffect(() => {
    fetchRecipe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  async function fetchRecipe() {
    try {
      const response = await axios.get(`api/recipes/${recipes}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setMyRecipe(response.data);
      console.log(response.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      setError(true)
      setLoading(false)
    }
  }

  function toggleEditMode(){
    if (editing){
      setEditing(false);
    } else {
      setEditing(true);
    }
  }

  // VARIABLES & FUNCTIONS FOR EDIT PAGE
  const [editorState, setEditorState] = useState(EditorState.createEmpty(""));
  const [measurementsList, setMeasurementsList] = useState(['']);
  const [recipeCategoryList, setRecipeCategoryList] = useState([{ name: '', id: -1 }]);
  const [recipeCategory, setRecipeCategory] = useState("0");
  const [name, setName] = useState("");
  const [fats, SetFats] = useState();
  const [proteins, SetProteins] = useState();
  const [carbohydrates, SetCarbohydrates] = useState();
  const [image, SetImage] = useState();
  const [prep, SetPrep] = useState();
  const [cook, setCookTime] = useState();
  const [servings, SetServings] = useState();
  const [notes, SetNotes] = useState();
  const [validationErrors, setValidationErrors] = useState([]);
  const [imageUploadMessage, setImageUploadMessage] = useState();
  const [response, setResponse] = useState("");
  const [statusCode, setStatusCode] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseHeader, setResponseHeader] = useState("");

  /*============================================================*/
  /*                   Setting States
  /*============================================================*/

  function onEditorStateChange(event) {
    // Summary:
    //   This function will update the state tracked by the instructions text editor.
    setEditorState(event.blocks[0].text);
  }

  async function ValidateInputFields() {
    const validationErrorList = [];
    let validationErrorMsg;
    if(!name) {
      validationErrorMsg = "Your recipe is missing a name!";
      validationErrorList.push(validationErrorMsg);
    }
    const IngredientInputFields = document.getElementsByClassName("ingredientInput");
    for(let i=0; i < IngredientInputFields.length; i += 3)
    {
      if(IngredientInputFields[i].value === "" || IngredientInputFields[i] === null) {
        validationErrorList.push("One of your ingredients is missing a name!");
      }
      if(isNaN(parseInt(IngredientInputFields[i+1].value))) {
        validationErrorList.push("One of your ingredients is missing a quantity!");
      }
      if(IngredientInputFields[i+2].value === "0" || IngredientInputFields[i+2].value === null) {
        validationErrorList.push("One of your ingredients is missing a unit of measure!");
      }
    }
    if(editorState == null) {
      validationErrorMsg = "Your recipe is missing instructions!";
      validationErrorList.push(validationErrorMsg);
    }
    if(isNaN(parseInt(prep))) {
      validationErrorMsg = "Please enter a number for prep time (min) to make your recipe!";
      validationErrorList.push(validationErrorMsg);
    }
    if(isNaN(parseInt(servings))) {
      validationErrorMsg = "Please enter a number for the number of servings your recipe makes!";
      validationErrorList.push(validationErrorMsg);
    }
    if(isNaN(parseInt(carbohydrates))) {
      validationErrorMsg = "Please enter a number for the amount of carbohydrates in your recipe!";
      validationErrorList.push(validationErrorMsg);
    }
    if(isNaN(parseInt(fats))) {
      validationErrorMsg = "Please enter a number for the amount of fat in your recipe!";
      validationErrorList.push(validationErrorMsg);
    }
    if(isNaN(parseInt(proteins))) {
      validationErrorMsg = "Please enter a number for the amount of protein in your recipe!";
      validationErrorList.push(validationErrorMsg);
    }
    if(recipeCategory === "0") {
      validationErrorMsg = "Please select a category your recipe belongs to!";
      validationErrorList.push(validationErrorMsg);
    }
    setValidationErrors(validationErrorList);
  }

  function SubmitRecipe(event) {
    // Summary:
    //   This function will send the recipe data from the form the user has filled out to the database and create a new recipe.
    event.preventDefault();
    ValidateInputFields();
    const ingredientsList = CreateIngredientList();
    if( validationErrors.length === 0 ) {
      axios({
        method: 'post',
        url: '/api/recipes',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        data: {
          "CategoryId": parseInt(recipeCategory),
          "Name": name,
          "Fat": fats,
          "Protein": proteins,
          "Carbohydrates": carbohydrates,
          "Instructions": editorState,
          "Ingredients": ingredientsList,
          "Image": image,
          "DateModified": new Date().toJSON(),
          "DateCreated": new Date().toJSON(),
          "PrepTime": prep,
          "CookTime": cook,
          "Servings": servings,
          "Notes": notes
        }
      }).then((res) => {
        setValidationErrors([]);
        setResponseHeader("Successfully added recipe");
        setResponse(res.data);
        setStatusCode(res.status);
      })
        .catch((err) => {
          setValidationErrors(["There was an error with the server."]);
          setResponse(err.response.data);
          setStatusCode(err.response.status);
        });
    }
  }

  function HandleFormChange(event) {
    // Summary:
    //   This function will set the state for the associated properties for the respective fields.
    switch (event.target.id)
    {
      case "addRecipeName":
      {
        setName(event.target.value);
        break;
      }
      case "addRecipeDescription":
      {
        break;
      }
      case "addRecipePrepTime":
      {
        SetPrep(event.target.value);
        break;
      }
      case "addRecipeCookTime":
      {
        setCookTime(event.target.value);
        break;
      }
      case "addRecipeServings":
      {
        SetServings(event.target.value);
        break;
      }
      case "addRecipeCategory":
      {
        setRecipeCategory(event.target.value);
        break;
      }
      case "addCarb":
      {
        SetCarbohydrates(event.target.value);
        break;
      }
      case "addFat":
      {
        SetFats(event.target.value);
        break;
      }
      case "addProtein":
      {
        SetProteins(event.target.value);
        break;
      }
      case "addRecipeExtraNotes":
      {
        SetNotes(event.target.value);
        break;
      }
      default:
      {
        break;
      }
    }
  }

  function PhotoUpload(event) {
    // Summary:
    //  This function will handle uploading the image file corresponding to the new recipe being added.
    event.preventDefault();
    const imageInput = document.getElementById("addRecipePhoto");

    // link @ https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios
    var formData = new FormData();
    formData.append("fileUpload", imageInput.files[0]);
    axios.post('https://localhost:5001/api/recipes/image-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user.token}`
      },
      data: formData

    }).then((res) => {
      if(res.status === 200 && imageInput.files[0] != null) {
        SetImage(res.data);
        setImageUploadMessage("Successfully uploaded image.");
      }
      else {
        setImageUploadMessage("Image upload failed.");
      }
    });
  }

  function AddIngredientForm(event) {
    // Summary:
    //  This function will add the required input fields to add an ingredient to the ingredient section once called upon.
    event.preventDefault();
    const ingredientSection = document.getElementById("ingredientBlock");
    const newIngredient = document.createElement("DIV");
    let childCount = ingredientSection.childElementCount;
    const newInput = document.createElement("INPUT");
    const newLabel = document.createElement("LABEL");
    const newQuantity = document.createElement("INPUT");
    const newQuantityLabel = document.createElement("LABEL");
    const newMeasureSelect = document.createElement("SELECT");
    const newMeasureLabel = document.createElement("LABEL");

    // Set the attributes for the input fields.
    newLabel.setAttribute("for", `ingredient${childCount / 4 + 1}`);
    newLabel.setAttribute("class", "block pl-4 pb-2 border-t-4 mt-2");
    newLabel.innerHTML = "Ingredient";
    newInput.setAttribute("id", `ingredient${childCount / 4 + 1}`);
    newInput.setAttribute("type", "text");
    newInput.setAttribute("class", "ingredientInput input-field mx-2 focus:outline-none focus:shadow-outline w-3/4");

    newQuantityLabel.setAttribute("for", `quantity${childCount / 4 + 1}`);
    newQuantityLabel.setAttribute("class", "block pl-4 pb-2");
    newQuantityLabel.innerHTML = `Quantity`;
    newQuantity.setAttribute("id", `quantity${childCount / 4 + 1}`);
    newQuantity.setAttribute("class", "ingredientInput input-field mx-2 focus:outline-none focus:shadow-outline w-3/4");

    newMeasureLabel.setAttribute("id", `measurement${childCount / 4 + 1}`);
    newMeasureLabel.setAttribute("class", "block pl-4 pb-2");
    newMeasureLabel.innerHTML = "Measurement";

    newMeasureSelect.setAttribute("id", `measurement${childCount / 4 + 1}`);
    newMeasureSelect.setAttribute("class", "border border-solid mx-4 ingredientInput");
    // Add the measurement options to the select field.
    for(let measurement in measurementsList) {
      const newOption = document.createElement("OPTION");
      newOption.setAttribute("value", `${measurementsList[measurement]}`);
      newOption.innerHTML = `${measurementsList[measurement]}`;
      newMeasureSelect.appendChild(newOption);
    }

    newIngredient.setAttribute("class", "block");
    // Add the new input fields to the section
    newIngredient.appendChild(newLabel);
    newIngredient.appendChild(newInput);
    newIngredient.appendChild(newQuantityLabel);
    newIngredient.appendChild(newQuantity);
    newIngredient.appendChild(newMeasureLabel);
    newIngredient.appendChild(newMeasureSelect);
    ingredientSection.appendChild(newIngredient);
  }

  function CreateIngredientList() {
    // Summary:
    //   This function will take all the ingredients in the form and create an Ingredient object for each one. All the ingredients will then be stored into a list.

    // Grab all the ingredient input fields:
    const IngredientInputFields = document.getElementsByClassName("ingredientInput");
    const tempIngredientList = [];
    for(let i = 0; i < IngredientInputFields.length; i += 3)
    {
      let newIngredient = {
        "Name": IngredientInputFields[i].value,
        "Quantity": IngredientInputFields[i+1].value,
        "UOM": IngredientInputFields[i+2].value
      }
      tempIngredientList.push(newIngredient);
    }
    return tempIngredientList;
  }

  /*============================================================*/
  /*                   State Refresh
  /*============================================================*/
  useEffect(()=> {
    async function getUOMs() {
      // Summary:
      //   This function will obtain the units of measure currently in the database and set the measurement list for the user to choose from.
      const response = await axios.get('/api/UOMs/all', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setMeasurementsList(response.data);
      setLoading(false);
    }

    async function getRecipeCategories() {
      // Summary:
      //   This function will obtain the recipe categories currently in the database and set the measurement list for the user to choose from.
      const res = await axios.get('/api/recipecategories/options', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setRecipeCategoryList(res.data);
      setLoading(false);
    }

    getUOMs();
    getRecipeCategories();
  },[loading, user.token]);

  useEffect(()=> {
    const errorList = [];
    if(validationErrors.length > 0) {
      setResponseHeader("ERROR: There was problem with your recipe!");
      for(let error in validationErrors)
      {
        errorList.push(<li className="list-disc">{validationErrors[error]}</li>);
      }
      setErrorMessage(errorList);
    }
  }, [validationErrors]);


  // If page is loading, render below...
  if (loading){
    return(
      <>
        <section className="mt-8">
          <p className="text-center">
            <i className="fas fa-spinner fa-spin fa-4x"></i>
          </p>
          <p className="text-center mt-2">
            Loading your recipe...
          </p>
        </section>
      </>
    )
  }

  // If Axios request has an error, display error message...
  if (error){
    return(
        <section className="mt-8">
          <p className="text-center">
            There was an error loading your Recipe. Please try again.
          </p>
          <p className="text-center mt-2">
            <button className="purple-button focus:outline-none focus:shadow-outline mr-1" type="submit" onClick={fetchRecipe}>
              Retry
            </button>
            <Link to={"/recipes"}>
              <button className="purple-button focus:outline-none focus:shadow-outline ml-1" type="submit">
                Return to Recipe List
              </button>
            </Link>
          </p>
        </section>
    )
  }

  // If Edit Recipe Button Clicked, Render Editing Page...
  if (editing) {
    return (
      <>
        <div className="container mx-2 my-4 w-full">
          <div className="block text-left my-4">
            <h1 className="font-bold text-lg">Editing Recipe - {myRecipe.name}</h1>
          </div>
          <h1 className="font-extrabold">{responseHeader}</h1>
          <ul>
            {errorMessage}
          </ul>
          <form onSubmit={SubmitRecipe}>
            <section id="addRecipeBasics" className="border-t-4 flex flex-row py-4">
              <div className="w-1/2 ">
                <h2 className="font-bold">Basic Information</h2>
                <p>Review Basic Information for recipe</p>
              </div>
              <div className="w-1/2 md:pl-12">
                <label htmlFor="addRecipeName" className="block pl-4 pb-2">Name(*):</label>
                <input className="input-field mx-2 focus:outline-none focus:shadow-outline w-3/4" type="text"
                       id="addRecipeName" defaultValue={myRecipe.name} onChange={HandleFormChange}/>
                <div>
                  <label htmlFor="addRecipePrepTime" className="block pl-4 pb-2">Prep. Time(*)(min):</label>
                  <input className="input-field mx-2 focus:outline-none focus:shadow-outline w-3/4" type="text"
                         id="addRecipePrepTime" defaultValue={myRecipe.prepTime} onChange={HandleFormChange}/>
                </div>
                <div>
                  <label htmlFor="addRecipeCookTime" className="block pl-4 pb-2">Cook Time(*)(min):</label>
                  <input className="input-field mx-2 focus:outline-none focus:shadow-outline w-3/4" type="text"
                         id="addRecipeCookTime" defaultValue={myRecipe.cookTime} onChange={HandleFormChange}/>
                </div>
                <div>
                  <label htmlFor="addRecipeServings" className="block pl-4 pb-2">Servings:</label>
                  <input className="input-field mx-2 focus:outline-none focus:shadow-outline w-3/4" type="text"
                         id="addRecipeServings" defaultValue={myRecipe.servings} onChange={HandleFormChange}/>
                </div>
                <div>
                  <label htmlFor="addRecipeCategory" className="block pl-4 pb-2">Recipe Category(*):</label>
                  <select className="border border-solid mx-4" id="addRecipeCategory" onChange={HandleFormChange}
                          defaultValue="0">
                    <option value="0"/>
                    {recipeCategoryList.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </section>
            <section id="addRecipeRequirements" className="border-t-4">
              <section id="ingredientSection" className="flex flex-row py-4">
                <div className="w-1/2">
                  <h2 className="font-bold">Ingredients</h2>
                  <p>Add or Remove Ingredients</p>
                  <button className=" block purple-button hover:bg-purple-700 focus:outline-none focus:shadow-outline"
                          onClick={AddIngredientForm}>Add Another Ingredient
                  </button>
                </div>
                <div className="md:pl-12 w-1/2">
                  <div className="block" id="ingredientBlock">
                    <label htmlFor="ingredient1" className="block pl-4 pb-2">Ingredient:</label>
                    <input className="ingredientInput input-field mx-2 focus:outline-none focus:shadow-outline w-3/4"
                           type="text" id="ingredient1" onChange={HandleFormChange}/>
                    <label htmlFor="quantity1" className="block pl-4 pb-2">Quantity:</label>
                    <input className="ingredientInput input-field mx-2 focus:outline-none focus:shadow-outline w-3/4"
                           type="text" id="quantity1" onChange={HandleFormChange}/>
                    <label htmlFor="measurement1" className="block pl-4 pb-2">Measurement:</label>
                    <select className="border border-solid mx-4 ingredientInput" id="measurement1"
                            onChange={HandleFormChange} defaultValue="0">
                      <option value="0"></option>
                      {measurementsList.map((measurement) => {
                        return (
                          <option className="pl-4" key={measurement} value={measurement}>{measurement}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </section>
              <section id="instructionSection" className="border-t-4 py-4">
                <h3 className="font-bold block">Instructions:</h3>
                <p>Review Instructions for your recipe</p>
                <div className="input-field">
                  <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onChange={onEditorStateChange}
                    defaultValue={myRecipe.instructions}
                  />
                </div>
              </section>
            </section>
            <section id="addRecipeNutritional" className="py-4 border-t-4 flex flex-row">
              <div className="w-1/2">
                <h2 className="font-bold">Nutritional Information</h2>
                <p>Review Nutritional Information for your recipe</p>
              </div>
              <div className="md:pl-12">
                <div>
                  <label htmlFor="addCarb" className="block pl-4 pb-2">Carbohydrates(*)</label>
                  <input className="input-field mx-2 focus:outline-none focus:shadow-outline w-3/4" type="number"
                         id="addCarb" defaultValue={myRecipe.carbohydrates} onChange={HandleFormChange}/>
                </div>
                <div>
                  <label htmlFor="addFat" className="block pl-4 pb-2">Fats(*)</label>
                  <input className="input-field mx-2 focus:outline-none focus:shadow-outline w-3/4" type="number"
                         id="addFat" defaultValue={myRecipe.fat} onChange={HandleFormChange}/>
                </div>
                <div>
                  <label htmlFor="addProtein" className="block pl-4 pb-2">Proteins(*)</label>
                  <input className="input-field mx-2 focus:outline-none focus:shadow-outline w-3/4" type="number"
                         id="addProtein" defaultValue={myRecipe.protein} onChange={HandleFormChange}/>
                </div>
              </div>
            </section>
            <section className="my-3 border-t-4 flex flex-row py-4">
              <div className="w-1/2">
                <h2 className="font-bold">Additional</h2>
                <p>Review any additional notes to your recipe</p>
              </div>
              <div className="w-1/2 md:pl-12">
                <label htmlFor="addRecipeExtraNotes" className="block pl-4 pb-2">Extra Notes:</label>
                <textarea
                  className="block input-field w-3/4 h-full lg:w-1/2 focus:outline-none focus:shadow-outline resize-none"
                  id="addRecipeExtraNotes" defaultValue={myRecipe.notes} onChange={HandleFormChange}/>
              </div>
            </section>
            <input className="cursor-pointer purple-button hover:bg-purple-700 focus:outline-none focus:shadow-outline"
                   type="submit"/>
          </form>
        </div>

        <br/>
        <button className="purple-button hover:bg-purple-700 focus:bg-purple-700 focus:shadow-outline" type="submit"
                onClick={toggleEditMode}>
          Disable Edit Mode - Dev Button - Remove Before Prod
        </button>
      </>
    )
  }


  // Assigning Ingredients to an array. Array is called in JSX below
  let ingredientsArray = [];
  for(let i in myRecipe.ingredients){
    ingredientsArray.push((
      <p key={i}>
        {`${parseInt(i) + 1}. ${myRecipe.ingredients[i].name} - ${myRecipe.ingredients[i].quantity} ${myRecipe.ingredients[i].uom}`}
      </p>
    ))
  }

  // If no axios Errors, and data is returned, render page...
  return(
    <div className="container mx-2 md:mx-auto max-w-screen-lg my-8">
      {/* TODO: change to myRecipe.image once images are stored in DB. Placeholder image used for now for styling */}
      <div className="flex justify-center my-8">
        <img className="p-2 w-1/3 border rounded" src={myRecipe.image} alt={myRecipe.name} />
      </div>
      <h1 className="text-4xl text-bold my-8">{myRecipe.name}</h1>
      <p className="text-md text-bold">Servings: {myRecipe.servings}</p>
      <p className="text-md text-bold">Prep Time: {myRecipe.prepTime}</p>

      <section className="flex flex-col md:flex-row md:justify-center my-8">

        <section className="md:w-1/2 md:flex md:flex-col">
            <h2 className="text-2xl text-bold my-4">Ingredients</h2>
          <div className="text-md">{ingredientsArray}</div>
          </section>

        <section className="md:w-1/2 md:ml-4 md:flex md:flex-col">
          <h2 className="text-2xl text-bold my-4">Macros</h2>
            <p className="text-md">Calories: {(parseInt(myRecipe.fat) * 9) + (parseInt(myRecipe.protein) * 4) +(parseInt(myRecipe.carbohydrates) * 4)}</p>
            <p className="text-md">Fat: {myRecipe.fat}g</p>
            <p className="text-md">Protein: {myRecipe.protein}g</p>
            <p className="text-md">Carbs: {myRecipe.carbohydrates}g</p>
           </section>

      </section>

      <section className="my-8">
        <h2 className="text-2xl text-bold my-4">Instructions</h2>
        <ReactMarkdown plugins={[gfm]} className="markdown">{myRecipe.instructions}</ReactMarkdown>
      </section>
      <section className="my-8">
        <h2 className="text-2xl text-bold my-4">Notes</h2>
        <ReactMarkdown plugins={[gfm]} className="markdown">{myRecipe.notes}</ReactMarkdown>
      </section>

      <section className="flex justify-around my-8">
        <button className="purple-button hover:bg-purple-700 focus:bg-purple-700 focus:shadow-outline" type="submit" onClick={toggleEditMode}>
          Edit Recipe
        </button>
        <Link to={"/recipes/"}>
          <button className="purple-button hover:bg-purple-700 focus:bg-purple-700 focus:shadow-outline" type="submit">
            Return to Recipe List
          </button>
        </Link>
      </section>
    </div>
  );
}

export default Recipe;
