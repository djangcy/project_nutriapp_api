![nutriapp_white_background](https://drive.usercontent.google.com/download?id=1p_MkRoGMsKgExTQJbi9rZBWobQdNTxI_&export=view&authuser=0)

---

**Note**: The Nutriapp mobile client was built with the intention of being an Android app and has been hosted as a web version ([Nutriapp Web](https://project-nutriapp.web.app/)) for easy accessibility for demonstration purposes. It is best experienced when accessed from a mobile device.

---

# Nutriapp

### 1. **Natural Language (NL) Querying:**
Finding recipes using keywords and filters can be tedious, and consume more time than it's worth. Natural language querying allows users to type in a sentence that covers all of their requirements, and returns a list of very real recipes. **Recipes are not generated using a NL model** since the information given back to the user could be invalid or false. NL queries will be used as input to a NL model that will generate a JSON object that contains the necessary fields to be used in a query that can be sent to an API that returns recipes. This allows for platform-independence and accuracy when constructing queries to the external API.

### OAS3 for API:
[Link to Swagger Specification](https://nutriapp*api-test-n2sjpazr4q-ew.a.run.app/docs/)

### Services:

- ************GPT 3.5:************ We make use of Open AI's GPT 3.5 to parse natural language into JSON objects that can be used to construct queries to a recipe API.
