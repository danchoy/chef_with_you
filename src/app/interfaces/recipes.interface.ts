export interface IRecipe {
    RecipeId: number,
    Name: string,
    AuthorId: number,
    AuthorName: string,
    CookTime: string,
    PrepTime: string,
    TotalTime: string,
    DatePublished: string,
    Images: string[],
    RecipeCategory: string,
    Keywords: string[],
    Ingredients: string[],
    RecipeInstructions: string[]
};

export interface IRecipeAndCount {
    totalCount: number,
    RecipeId: number,
    Name: string,
    AuthorId: number,
    AuthorName: string,
    CookTime: string,
    PrepTime: string,
    TotalTime: string,
    DatePublished: string,
    Images: string[],
    RecipeCategory: string,
    Keywords: string[],
    Ingredients: string[],
    RecipeInstructions: string[]
};

export interface IRecipes {
    data: IRecipe[],
    page: number
}