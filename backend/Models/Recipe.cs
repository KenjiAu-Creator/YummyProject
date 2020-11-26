using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Api.Controllers;
using FluentValidation;

namespace Api.Models
{
  // TODO: Very Likely should be extracted to it's own file
  //       Probably under Models.Validators
  public class RecipeValidator : AbstractValidator<Recipe> {
    public RecipeValidator() {
      RuleFor(x => x.CategoryId)
        .NotEqual(0);

      RuleFor(x => x.Name)
        .NotEmpty()
        .Length(3, 50);

      RuleFor(x => x.Fat)
        .GreaterThanOrEqualTo(0)
        .LessThanOrEqualTo(100000);

      RuleFor(x => x.Protein)
        .GreaterThanOrEqualTo(0)
        .LessThanOrEqualTo(100000);

      RuleFor(x => x.Carbohydrates)
        .GreaterThanOrEqualTo(0)
        .LessThanOrEqualTo(100000);

      RuleFor(x => x.Calories)
        .GreaterThanOrEqualTo(0)
        .LessThanOrEqualTo(100000);

      RuleFor(x => x.Instructions)
        .Length(10, 60000);

      RuleFor(x => x.Notes)
        .Length(0, 5000);

      RuleFor(x => x.Servings)
        .GreaterThanOrEqualTo(0)
        .LessThanOrEqualTo(1000);

      RuleFor(x => x.PrepTime)
        .GreaterThanOrEqualTo(0)
        .LessThanOrEqualTo(6000);

      RuleFor(x => x.Image)
        .NotNull();

      // TODO: Implement rules for Ingredients
      //       See: https://docs.fluentvalidation.net/en/latest/start.html#complex-properties

      RuleSet("Create", CreateRules);
      RuleSet("Update", UpdateRules);
    }

    private void CreateRules() {
      RuleFor(x => x.Id)
        .Empty()
        .WithMessage("Cannot set id of a recipe during creation");
    }

    private void UpdateRules() {
      RuleFor(x => x.Id)
        .NotEqual(0);
    }
  }

  [Table("Recipes")]
  public class Recipe {

    [Key]
    [Column(TypeName = "int(10)")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "int(10)")]
    public int CategoryId { get; set; }

    [Required]
    [Column(TypeName = "varchar(50)")]
    public string Name { get; set; }

    [Required]
    [Column(TypeName = "int(10)")]
    public int Fat { get; set; }

    [Required]
    [Column(TypeName = "int(10)")]
    public int Protein { get; set; }

    [Required]
    [Column(TypeName = "int(10)")]
    public int Carbohydrates { get; set; }

    [Required]
    [Column(TypeName = "int(10)")]
    public int Calories { get; set; }

    [Required]
    [Column(TypeName = "longtext")]
    public string Instructions { get; set; }

    [Column(TypeName = "json")]
    public List<string> Tags { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string Image { get; set; }

    [Required]
    [Column(TypeName = "date")]
    public DateTime DateModified { get; set; }

    [Required]
    [Column(TypeName = "date")]
    public DateTime DateCreated { get; set; }

    [Required]
    [Column(TypeName = "decimal(10, 3)")]
    public decimal PrepTime { get; set; }

    [Required]
    [Column(TypeName = "int(10)")]
    public int Servings { get; set; }

    [Column(TypeName = "varchar(500)")]
    public string Notes { get; set; }

    [Column(TypeName = "varchar(50)")]
    public string UserId { get; set; }

    public Recipe(string name) {
      Name = name;
    }

    // TODO: More investigation, but required by EF
    //protected Recipe() {}

    public virtual ICollection<Ingredient> Ingredients { get; private set; } = new HashSet<Ingredient>();

    public virtual ICollection<MealRecipe> MealRecipes { get; set; } = new HashSet<MealRecipe>();

    public virtual RecipeCategory RecipeCategory { get; set; }

    public Recipe()
    {
    }
  }
}
