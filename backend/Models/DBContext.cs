using System;
using System.Collections.Generic;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Linq;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Api.Authentication;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace Api.Models
{
  public class DBContext : IdentityDbContext<User>
  {
    public virtual DbSet<Recipe> Recipes { get; set; }

    public virtual DbSet<Plan> Plans { get; set; }

    public virtual DbSet<Ingredient> Ingredients { get; set; }

    public virtual DbSet<UOM> UOMs { get; set; }

    public virtual DbSet<RecipeCategory> RecipeCategories { get; set; }

    public virtual DbSet<Meal> Meals { get; set; }

    public virtual DbSet<MealTime> MealTimes { get; set; }

    public virtual DbSet<MealRecipe> MealRecipes { get; set; }

    public DBContext(DbContextOptions<DBContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      string userId = "927249ee-afd9-4bd0-b74e62053687d989";
      DateTime anchorDate = new DateTime(2020, 12, 9);

      base.OnModelCreating(modelBuilder);
      modelBuilder.Entity<Recipe>(entity =>
      {
        entity.HasMany(a => a.Ingredients)
          .WithOne()
          .HasForeignKey(key => key.RecipeId)
          .OnDelete(DeleteBehavior.Cascade);

        entity.Property(e => e.Image)
          .HasDefaultValue(string.Empty);

        entity.HasData(
          new Recipe()
          {
            Id = -1,
            CategoryId = -1,
            UserId = userId,
            Name = "Chicken and Potatoes with Hot Sauce",
            Fat = 30,
            Protein = 70,
            Carbohydrates = 100,
            Instructions = string.Join("\n",
              "* Cook Chicken",
              "* Cook Potatoes",
              "* Smother in Hot Sauce"
            ),
            Image = $"images/User_{userId}/chicken-potato-hotsauce.jpg",
            DateModified = DateTime.Today,
            DateCreated = DateTime.Today,
            PrepTime = 35,
            CookTime = 30,
            Servings = 2,
            Notes = string.Join("\n",
              "* Marinate Chicken for at least 12 hours for maximum flavor"
              )
          },
          new Recipe()
          {
            Id = -2,
            CategoryId = -2,
            UserId = userId,
            Name = "Steak and Sweet Potatoes",
            Fat = 10,
            Protein = 70,
            Carbohydrates = 115,
            Instructions = string.Join("\n",
              "* Cook Steak on BBQ",
              "* Cook Potatoes to personal preference",
              "* Serve and Enjoy!"
            ),
            Image = $"images/User_{userId}/steak-sweet-potato.jpeg",
            DateModified = DateTime.Today,
            DateCreated = DateTime.Today,
            PrepTime = 25,
            CookTime = 20,
            Servings = 2,
            Notes = string.Join("\n",
              "* Marinate Steak for at least 12 hours for maximum flavor",
              "* Can be cooked on the stovetop but is better when BBQ'd",
              "* Potatoes can be diced, sliced, or baked. Personal preference."
            )
          },
          new Recipe()
          {
            Id = -3,
            CategoryId = -1,
            UserId = userId,
            Name = "Butter Chicken",
            Fat = 11,
            Protein = 20,
            Carbohydrates = 10,
            Instructions = string.Join("\n",
              "* 1. Place the olive oil, garlic, chilies, onion, and ginger in a blender and purée until smooth.",
            "* 2. Heat ghee in a large dutch oven over medium-high. Add the onion purée and cook until the mixture darkens slightly and softens, about 15 minutes.",
            "* 3. Add the tomato paste, turmeric, chili powder, garam masala, coriander, and cumin and cook for 5 minutes, or until dark and sticky.",
            "* 4. Add in 1 1/2 cups water. Using a wooden spoon, scrape up any browned bits at the bottom of the pan.",
            "* 5. Stir in the tomato puree and fenugreek leaves and increase the heat to high. Bring to a boil, then reduce the heat to maintain a simmer. Cover and cook, stirring occasionally, until thick, about 1 hour. Add the chicken and cook until the chicken is cooked through, about 15 minutes more.",
            "* 6. Add the cream and butter and stir to combine. Season with salt and serve garnished with fresh cilantro with steamed Jasmine rice."
            ),
            Image = $"images/User_{userId}/butter-chicken.jpg",
            DateModified = DateTime.Today,
            DateCreated = DateTime.Today,
            PrepTime = 65,
            CookTime = 40,
            Servings = 8,
            Notes = string.Join("\n",
              "* Delicious!"
            )
          },
          new Recipe()
          {
            Id = -4,
            CategoryId = -4,
            UserId = userId,
            Name = "Black Bean Quesadillas",
            Fat = 16,
            Protein = 13,
            Carbohydrates = 45,
            Instructions = string.Join("\n",
              "1. Combine beans, cheese and 1/4 cup salsa in a medium bowl.",
            "2. Place tortillas on a work surface.",
            "3. Spread 1/2 cup filling on half of each tortilla.",
            "4. Fold tortillas in half, pressing gently to flatten.",
            "5. Heat 1 teaspoon oil in a large nonstick skillet over medium heat.",
            "6. Add 2 quesadillas and cook, turning once, until golden on both sides, 2 to 4 minutes total.",
            "7. Transfer to a cutting board and tent with foil to keep warm. Repeat with the remaining 1 teaspoon oil and quesadillas.",
            "8. Serve the quesadillas with avocado and the remaining salsa."
            ),
            Image = $"images/User_{userId}/blackbean-quesadilla.jpg",
            DateModified = DateTime.Today,
            DateCreated = DateTime.Today,
            PrepTime = 25,
            CookTime = 5,
            Servings = 4,
            Notes = string.Join("\n",
              "Tip: Look for prepared fresh salsa in the supermarket refrigerator section near other dips and spreads.")
          },
          new Recipe()
          {
            Id = -5,
            CategoryId = -1,
            UserId = userId,
            Name = "Chipotle and Orange grilled Chicken",
            Fat = 3,
            Protein = 23,
            Carbohydrates = 6,
            Instructions = string.Join("\n",
              "1. Preheat grill or broiler.",
            "2. Whisk together orange-juice concentrate, chipotle pepper, vinegar, molasses and mustard in a small bowl.",
            "3. Lightly oil the grill or broiler rack (see Tip).",
            "4. Season chicken with salt and grill or broil for 2 minutes.",
            "5. Turn, brush with the glaze and cook for 4 minutes, brushing occasionally with glaze.",
            "6. Turn again, brush with the glaze, and cook until the center is no longer pink, 1 to 2 minutes longer."
            ),
            Image = $"images/User_{userId}/chipotle-orange-chicken.jpg",
            DateModified = DateTime.Today,
            DateCreated = DateTime.Today,
            PrepTime = 45,
            CookTime = 15,
            Servings = 4,
            Notes = string.Join("\n",
              "* Chipotle chiles in adobo sauce are smoked jalapeños packed in a flavorful sauce.",
            "* Look for the small cans with the Mexican foods in large supermarkets.",
            "* Once opened, they'll keep up to 2 weeks in the refrigerator or 6 months in the freezer.",
            "* Tip: To oil a grill rack: Oil a folded paper towel, hold it with tongs and rub it over the rack. (Do not use cooking spray on a hot grill.)",
            "* When grilling delicate foods like tofu and fish, it is helpful to spray the food with cooking spray.")
          }
        );
      });

      modelBuilder.Entity<MealRecipe>(entity =>
      {
        // Making composite key
        // https://www.learnentityframeworkcore.com/configuration/many-to-many-relationship-configuration
        entity.HasKey(x => new {x.MealId, x.RecipeId});

        entity.HasOne(a => a.Meal)
          .WithMany(b => b.MealRecipes)
          .HasForeignKey(c => c.MealId)
          .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(a => a.Recipe)
          .WithMany(b => b.MealRecipes)
          .HasForeignKey(c => c.RecipeId)
          .OnDelete(DeleteBehavior.Cascade);

        entity.HasData(
          new MealRecipe()
          {
            MealId = -1,
            RecipeId = -1
          },
          new MealRecipe()
          {
            MealId = -2,
            RecipeId = -2
          }
        );
      });

      modelBuilder.Entity<Plan>(entity =>
      {
        entity.HasMany(a => a.Meals)
          .WithOne()
          .HasForeignKey(b => b.PlanId)
          .OnDelete(DeleteBehavior.Cascade);

        entity.HasData(
          new Plan()
          {
            Id = -1,
            UserId = userId,
            Day = anchorDate
          }
        );
      });

      modelBuilder.Entity<Meal>(entity =>
      {
        entity.HasOne(a => a.MealTime)
          .WithMany()
          .HasForeignKey(b => b.MealTimeId)
          .OnDelete(DeleteBehavior.Restrict);

        entity.HasData(
          new Meal()
          {
            Id = -1,
            PlanId = -1,
            MealTimeId = -2
          },
          new Meal()
          {
            Id = -2,
            PlanId = -1,
            MealTimeId = -3
          }
        );
      });

      modelBuilder.Entity<RecipeCategory>(entity =>
      {
        entity.HasMany(a => a.Recipes)
          .WithOne(b => b.RecipeCategory)
          .HasForeignKey(c => c.CategoryId)
          .OnDelete(DeleteBehavior.Restrict);

        entity.HasData(
          new RecipeCategory()
          {
            Id = -1,
            Name = "Chicken"
          },
          new RecipeCategory()
          {
            Id = -2,
            Name = "Beef"
          },
          new RecipeCategory()
          {
            Id = -3,
            Name = "Fish"
          },
          new RecipeCategory()
          {
            Id = -4,
            Name = "Vegetarian"
          },
          new RecipeCategory()
          {
            Id = -5,
            Name = "Vegan"
          }
        );
      });

      modelBuilder.Entity<Ingredient>(entity =>
      {
        entity.HasOne(a => a.UOM)
          .WithMany()
          .HasForeignKey(c => c.UOMId)
          .OnDelete(DeleteBehavior.Restrict);

        entity.HasData(
          new Ingredient()
          {
            Id = -1,
            RecipeId = -1,
            Name = "Chicken Breast",
            Quantity = 3,
            UOMId = "lb",
          },
          new Ingredient()
          {
            Id = -2,
            RecipeId = -1,
            Name = "Hot Sauce",
            Quantity = 1,
            UOMId = "cup"
          },
          new Ingredient()
          {
            Id = -3,
            RecipeId = -1,
            Name = "Potato",
            Quantity = 4,
            UOMId = "ea"
          },
          new Ingredient()
          {
            Id = -7,
            RecipeId = -3,
            Name = "Olive Oil",
            Quantity = 6,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -8,
            RecipeId = -3,
            Name = "Garlic cloves",
            Quantity = 5,
            UOMId = "ea"
          },
          new Ingredient()
          {
            Id = -9,
            RecipeId = -3,
            Name = "Yellow onion",
            Quantity = 2,
            UOMId = "ea"
          },
          new Ingredient()
          {
            Id = -10,
            RecipeId = -3,
            Name = "ghee",
            Quantity = 0.5m,
            UOMId = "cup"
          },
          new Ingredient()
          {
            Id = -11,
            RecipeId = -3,
            Name = "Tomato paste",
            Quantity = 3,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -12,
            RecipeId = -3,
            Name = "Tumeric",
            Quantity = 3,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -13,
            RecipeId = -3,
            Name = "Chili powder",
            Quantity = 2,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -14,
            RecipeId = -3,
            Name = "Garam masala",
            Quantity = 2,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -15,
            RecipeId = -3,
            Name = "Ground coriander",
            Quantity = 2,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -16,
            RecipeId = -3,
            Name = "Ground cumin",
            Quantity = 2,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -17,
            RecipeId = -3,
            Name = "Tomato puree",
            Quantity = 3.5m,
            UOMId = "cup"
          },
          new Ingredient()
          {
            Id = -18,
            RecipeId = -3,
            Name = "Chicken Breast",
            Quantity = 4,
            UOMId = "ea"
          },
          new Ingredient()
          {
            Id = -19,
            RecipeId = -3,
            Name = "Heavy Cream",
            Quantity = 2,
            UOMId = "cup"
          },
          new Ingredient()
          {
            Id = -20,
            RecipeId = -3,
            Name = "Unsalted butter",
            Quantity = 8,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -21,
            RecipeId = -3,
            Name = "Cooked Jasmine Rice",
            Quantity = 5,
            UOMId = "cup"
          },
          new Ingredient()
          {
            Id = -22,
            RecipeId = -4,
            Name = "Black Beans",
            Quantity = 15,
            UOMId = "oz"
          },
          new Ingredient()
          {
            Id = -23,
            RecipeId = -4,
            Name = "Shredded Monterey Jack Cheese",
            Quantity = 0.5m,
            UOMId = "cup"
          },
          new Ingredient()
          {
            Id = -24,
            RecipeId = -4,
            Name = "Salsa",
            Quantity = 0.5m,
            UOMId = "cup"
          },
          new Ingredient()
          {
            Id = -25,
            RecipeId = -4,
            Name = "Tortillas",
            Quantity = 4,
            UOMId = "ea"
          },
          new Ingredient()
          {
            Id = -26,
            RecipeId = -4,
            Name = "Canola oil",
            Quantity = 2,
            UOMId = "tsp"
          },
          new Ingredient()
          {
            Id = -27,
            RecipeId = -4,
            Name = "Avocado, diced",
            Quantity = 1,
            UOMId = "ea"
          },
          new Ingredient()
          {
            Id = -28,
            RecipeId = -5,
            Name = "Orange juice concentrate",
            Quantity = 2,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -29,
            RecipeId = -5,
            Name = "Finely chopped chipotle peppers(See notes)",
            Quantity = 1,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -30,
            RecipeId = -5,
            Name = "Balsamic Vinegar",
            Quantity = 1,
            UOMId = "tbsp"
          },
          new Ingredient()
          {
            Id = -31,
            RecipeId = -5,
            Name = "Unsulfured Molasses",
            Quantity = 2,
            UOMId = "tsp"
          },
          new Ingredient()
          {
            Id = -32,
            RecipeId = -5,
            Name = "Dijon mustard",
            Quantity = 1,
            UOMId = "tsp"
          },
          new Ingredient()
          {
            Id = -33,
            RecipeId = -5,
            Name = "Chicken Breast",
            Quantity = 1,
            UOMId = "lb"
          },
          new Ingredient()
          {
            Id = -34,
            RecipeId = -5,
            Name = "Salt",
            Quantity = 1,
            UOMId = "tsp"
          }
        );
      });

      modelBuilder.Entity<UOM>(entity =>
      {
        entity.HasData(
          new UOM()
          {
            Id = "g",
            Name = "Gram"
          },
          new UOM()
          {
            Id = "oz",
            Name = "Ounce"
          },
          new UOM()
          {
            Id = "ml",
            Name = "Milliliter"
          },
          new UOM()
          {
            Id = "L",
            Name = "Liter"
          },
          new UOM()
          {
            Id = "cup",
            Name = "Cup"
          },
          new UOM()
            {
              Id = "tsp",
              Name = "Teaspoon"
            },
          new UOM()
            {
              Id = "tbsp",
              Name = "Tablespoon"
            },
          new UOM()
            {
              Id = "lb",
              Name = "Pound"
            },
          new UOM()
          {
            Id = "kg",
            Name = "Kilogram"
          },
          new UOM()
          {
            Id = "ea",
            Name = "Each"
          }
        );
      });

      modelBuilder.Entity<User>(entity =>
      {
        entity.HasData(
          new User()
          {
            // Identity uses a GUID method to generate unique user id.
            Id = userId,
            Name = "DemoUser",
            UserName = "demo@example.com",
            NormalizedUserName = "DEMO@EXAMPLE.COM",
            Email = "demo@example.com",
            NormalizedEmail = "DEMO@EXAMPLE.COM",
            EmailConfirmed = true,
            PasswordHash = "AQAAAAEAACcQAAAAEF2K8rjzLW+Pg5eripVafumGQa/4BRTSboiXDMa95qTMTPdH249hphHAkUQHUE0Ctw==",
            SecurityStamp = "MVLR77ABXD2ZQFYVDR6NAJB7UASX45MD",
            ConcurrencyStamp = "9ce7c801-2204-473c-9967-110632a96a79",
            LockoutEnabled = true
          }
        );
      });

      modelBuilder.Entity<MealTime>(entity =>
      {
        entity.HasData(
          new MealTime()
          {
            Id = -1,
            Name = "Breakfast"
          },
          new MealTime()
          {
            Id = -2,
            Name = "Lunch"
          },
          new MealTime()
          {
            Id = -3,
            Name = "Dinner"
          }
        );
      });
    }
  }
}
