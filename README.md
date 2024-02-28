![nutriapp_white_background](https://drive.usercontent.google.com/download?id=1p_MkRoGMsKgExTQJbi9rZBWobQdNTxI_&export=view&authuser=0)

# Nutriapp

**Natural Language (NL) Querying:**
Finding recipes using keywords and filters can be tedious, and consume more time than it's worth. Natural language querying allows users to type in a sentence that covers all of their requirements, and returns a list of very real recipes. **Recipes are not generated using a NL model** since the information given back to the user could be invalid or false. NL queries will be used as input to a NL model that will generate a JSON object that contains the necessary fields to be used in a query that can be sent to an API that returns recipes. This allows for platform-independence and accuracy when constructing queries to the external API.

### OAS3 for API:
[Link to Swagger Specification](https://project-nutriapp-api-jssazxytfq-ew.a.run.app/docs/#/)

**The specification above is the official specification and is maintained with the API. Any public endpoints available to the client are specified above.**
**Feature requests for the API can be made [here](https://github.com/djangcy/nutrition_app/issues/new/choose). Be sure to mention [@djangcy](https://www.github.com/djangcy) in any feature requests.**

### Services:

- ************GPTs:************ GPTs require significantly less training while providing more appropriate output when compared to Cohere. The current infrastructure works correctly using Cohere, but it is definitely something to look into.

- ************Cohere:************ Cohere is an extensive AI model training platform that allows us to query the custom models that we create on the platform. We can leverage Cohere for the natural language querying and recipe evaluation. We could create the following models:
    - Natural language parser:
    This model is trained on potential natural language queries that a user may enter, expecting a recipe matching their requirements to be returned. The model will return a JSON object containing query parameters such as calories, dietary restrictions, nutritional values, macros, ingredients, etc., which will then be used to construct a query that will be passed on the the recipe service.
    - Recipe parser:
    This model is trained on recipes and ingredient lists. Recipes that are presented from the web do not follow a standardized format, and often include text unrelated to the recipe itself such as stories. A recipe parser will be able to read a recipe and remove the unnecessary text, and format the important text to make it easier for the user to read.
    
    Note: **Without the recipe parser**, the response to the client will only include a web link to the recipe (which the user will open in their browser, or be shown via an embedded view in the app). **With the recipe parser**, the response will include a web link to the original recipe, as well as the parsed recipe.
    
    A parsed recipe also allows us to add additional functionality such as recipe editing, ingredient substitution, and nutrition reports.
    
    Idea: Premium users will be able to supply their own web link to a recipe, which we can parse and give back to them.
- ************Edamam************: Edamam is an API that allows us to query recipes, nutritional information, nutrition analysis, and foods. We will leverage their corpus for our services.
