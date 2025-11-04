### POST /v1/responses - Structured Output Generation

Source: https://platform.openai.com/docs/guides/structured-outputs

This endpoint allows users to request structured outputs from OpenAI models by providing an input prompt and a JSON schema. It is designed for applications requiring strict adherence to a defined output format, such as chain-of-thought reasoning or structured data extraction.

```APIDOC
## POST /v1/responses

### Description
This endpoint facilitates the generation of highly structured and schema-compliant text outputs from OpenAI models. It's ideal for use cases that require strict data formats, such as structured data extraction, content moderation, or generating step-by-step reasoning.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Request Body
- **model** (string) - Required - The ID of the model to use for the request. Compatible models include `gpt-4o-mini`, `gpt-4o-mini-2024-07-18`, and `gpt-4o-2024-08-06`.
- **input** (array of objects) - Required - A list of messages comprising the conversation so far, similar to the Chat Completions API.
  - **input[].role** (string) - Required - The role of the author of this message (e.g., "system", "user").
  - **input[].content** (string) - Required - The content of the message.
- **text** (object) - Required - Configuration for text-based outputs, specifically for structured formatting.
  - **text.format** (object) - Required - Specifies the desired output format.
    - **text.format.type** (string) - Required - Must be set to `"json_schema"` to enable structured output.
    - **text.format.name** (string) - Optional - A name for the schema, primarily for internal identification or logging.
    - **text.format.schema** (object) - Required - The JSON schema that the model's output must adhere to.
      - **text.format.schema.type** (string) - Required - The type of the root JSON object (e.g., `"object"`).
      - **text.format.schema.properties** (object) - Required - Defines the properties of the root object according to JSON Schema specification.
        - **text.format.schema.properties.steps** (array of objects) - Required - An array containing objects, each representing a step.
          - **text.format.schema.properties.steps[].explanation** (string) - Required - A description of the step.
          - **text.format.schema.properties.steps[].output** (string) - Required - The result or output of the step.
        - **text.format.schema.properties.final_answer** (string) - Required - The final answer or conclusion.
      - **text.format.schema.required** (array of strings) - Required - A list of property names that must be present in the output.
      - **text.format.schema.additionalProperties** (boolean) - Optional - If `false`, no properties beyond those specified in `properties` are allowed.
    - **text.format.strict** (boolean) - Optional - If `true`, the model is instructed to adhere to the schema strictly, potentially leading to more reliable but sometimes less flexible outputs.

### Request Example
```json
{
  "model": "gpt-4o-2024-08-06",
  "input": [
    {
      "role": "system",
      "content": "You are a helpful math tutor. Guide the user through the solution step by step."
    },
    {
      "role": "user",
      "content": "how can I solve 8x + 7 = -23"
    }
  ],
  "text": {
    "format": {
      "type": "json_schema",
      "name": "math_reasoning",
      "schema": {
        "type": "object",
        "properties": {
          "steps": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "explanation": { "type": "string" },
                "output": { "type": "string" }
              },
              "required": ["explanation", "output"],
              "additionalProperties": false
            }
          },
          "final_answer": { "type": "string" }
        },
        "required": ["steps", "final_answer"],
        "additionalProperties": false
      },
      "strict": true
    }
  }
}
```

### Response
#### Success Response (200)
- **steps** (array of objects) - An array of objects, where each object represents a step in the reasoning process.
  - **steps[].explanation** (string) - A natural language explanation of the step.
  - **steps[].output** (string) - The mathematical or logical output of the step.
- **final_answer** (string) - The ultimate solution or answer derived from the steps.

#### Response Example
```json
{
  "steps": [
    {
      "explanation": "Start with the equation 8x + 7 = -23.",
      "output": "8x + 7 = -23"
    },
    {
      "explanation": "Subtract 7 from both sides to isolate the term with the variable.",
      "output": "8x = -23 - 7"
    },
    {
      "explanation": "Simplify the right side of the equation.",
      "output": "8x = -30"
    },
    {
      "explanation": "Divide both sides by 8 to solve for x.",
      "output": "x = -30 / 8"
    },
    {
      "explanation": "Simplify the fraction.",
      "output": "x = -15 / 4"
    }
  ],
  "final_answer": "x = -15 / 4"
}
```
```

--------------------------------

### POST /v1/responses (Moderation with Structured Outputs)

Source: https://platform.openai.com/docs/guides/structured-outputs

Classifies user input for moderation purposes by enforcing a predefined JSON schema for the output. This allows for structured detection of violations and explanations.

```APIDOC
## POST /v1/responses

### Description
This endpoint allows you to send user input to an OpenAI model and receive a structured output based on a provided JSON schema. It is particularly useful for moderation tasks, enabling programmatic classification of content against defined compliance rules.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Request Body
- **model** (string) - Required - The ID of the model to use for the request, e.g., "gpt-4o-2024-08-06".
- **input** (array of objects) - Required - A list of messages comprising the conversation history.
  - **input[].role** (string) - Required - The role of the author of this message, typically "system" or "user".
  - **input[].content** (string) - Required - The content of the message.
- **text.format** (object) - Required - Specifies the desired output format as a JSON schema.
  - **text.format.type** (string) - Required - Must be set to "json_schema".
  - **text.format.name** (string) - Optional - A descriptive name for the schema, e.g., "content_compliance".
  - **text.format.description** (string) - Optional - A brief explanation of what the schema is designed to do.
  - **text.format.schema** (object) - Required - The JSON schema definition that the model's output must adhere to.
    - **text.format.schema.type** (string) - Required - Specifies the root type of the schema, typically "object".
    - **text.format.schema.properties** (object) - Required - Defines the expected properties of the output JSON object.
      - **text.format.schema.properties.is_violating** (boolean) - Required - Indicates whether the input content violates any specified guidelines.
      - **text.format.schema.properties.category** (string | null) - Optional - The specific category of violation if `is_violating` is true. Can be one of "violence", "sexual", or "self_harm". Null otherwise.
      - **text.format.schema.properties.explanation_if_violating** (string | null) - Optional - A detailed explanation of why the content is considered violating, if applicable. Null otherwise.
    - **text.format.schema.required** (array of strings) - Required - A list of property names that must be present in the output, e.g., ["is_violating", "category", "explanation_if_violating"].
    - **text.format.schema.additionalProperties** (boolean) - Optional - Set to `false` to prevent the model from generating properties not defined in the schema.
    - **text.format.schema.strict** (boolean) - Optional - When `true`, enforces strict adherence to the schema, rejecting outputs that do not conform.

### Request Example
```json
{
  "model": "gpt-4o-2024-08-06",
  "input": [
    {
      "role": "system",
      "content": "Determine if the user input violates specific guidelines and explain if they do."
    },
    {
      "role": "user",
      "content": "How do I prepare for a job interview?"
    }
  ],
  "text": {
    "format": {
      "type": "json_schema",
      "name": "content_compliance",
      "description": "Determines if content is violating specific moderation rules",
      "schema": {
        "type": "object",
        "properties": {
          "is_violating": {
            "type": "boolean",
            "description": "Indicates if the content is violating guidelines"
          },
          "category": {
            "type": ["string", "null"],
            "description": "Type of violation, if the content is violating guidelines. Null otherwise.",
            "enum": ["violence", "sexual", "self_harm"]
          },
          "explanation_if_violating": {
            "type": ["string", "null"],
            "description": "Explanation of why the content is violating"
          }
        },
        "required": ["is_violating", "category", "explanation_if_violating"],
        "additionalProperties": false
      },
      "strict": true
    }
  }
}
```

### Response
#### Success Response (200)
- **is_violating** (boolean) - Indicates if the content was deemed violating based on the provided schema and rules.
- **category** (string | null) - The category of violation if `is_violating` is true (e.g., "violence", "sexual", "self_harm"), otherwise null.
- **explanation_if_violating** (string | null) - A textual explanation for the violation if `is_violating` is true, otherwise null.

#### Response Example
```json
{
  "is_violating": false,
  "category": null,
  "explanation_if_violating": null
}
```
```

--------------------------------

### Example Structured Output for Chain-of-Thought Math Tutoring

Source: https://platform.openai.com/docs/guides/structured-outputs_context=with_parse

This JSON object represents an example of the structured output generated by the OpenAI API when using the chain-of-thought math tutoring schema. It includes an array of steps, each with an explanation and an intermediate output, culminating in a final answer.

```json
{
  "steps": [
    {
      "explanation": "Start with the equation 8x + 7 = -23.",
      "output": "8x + 7 = -23"
    },
    {
      "explanation": "Subtract 7 from both sides to isolate the term with the variable.",
      "output": "8x = -23 - 7"
    },
    {
      "explanation": "Simplify the right side of the equation.",
      "output": "8x = -30"
    },
    {
      "explanation": "Divide both sides by 8 to solve for x.",
      "output": "x = -30 / 8"
    },
    {
      "explanation": "Simplify the fraction.",
      "output": "x = -15 / 4"
    }
  ],
  "final_answer": "x = -15 / 4"
}
```

--------------------------------

### POST /v1/responses (Structured Output)

Source: https://platform.openai.com/docs/guides/structured-outputs

This endpoint allows users to generate structured outputs from OpenAI models by providing a JSON schema. The model will attempt to adhere to the specified schema for its text output, ensuring predictable data formats.

```APIDOC
## POST /v1/responses

### Description
Generates a model response structured according to a provided JSON schema. This ensures the model's text output conforms to a predefined format.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Path Parameters
_None_

#### Query Parameters
_None_

#### Request Body
- **model** (string) - Required - The ID of the model to use for the request (e.g., "gpt-4o-2024-08-06").
- **input** (array of objects) - Required - A list of messages comprising the conversation history.
  - **role** (string) - Required - The role of the message sender, one of `system`, `user`, `assistant`.
  - **content** (string) - Required - The textual content of the message.
- **text** (object) - Required - Parameters related to text generation, specifically for structured outputs.
  - **format** (object) - Required - Specifies the desired output format.
    - **type** (string) - Required - Must be `"json_schema"` to enable structured output.
    - **name** (string) - Optional - A name for the schema, used for caching and optimization. Recommended for performance.
    - **schema** (object) - Required - The JSON Schema object that the model's output should conform to.
      - **type** (string) - Required - The root type of the schema (e.g., `"object"`, `"array"`).
      - **properties** (object) - Optional - Defines properties for an object schema, mapping property names to their schemas.
      - **items** (object) - Optional - Defines the schema for items within an array schema.
      - **required** (array of strings) - Optional - A list of property names that must be present in an object schema.
      - **additionalProperties** (boolean) - Optional - If `false`, additional properties not defined in `properties` are not allowed. Defaults to `true`.
    - **strict** (boolean) - Required - If `true`, the model will strictly adhere to the schema, potentially retrying generation to fix invalid outputs. If `false`, the model might deviate if it cannot perfectly match.

### Request Example
```json
{
  "model": "gpt-4o-2024-08-06",
  "input": [
    {
      "role": "system",",
```

--------------------------------

### POST /v1/responses - Moderation with Structured Outputs

Source: https://platform.openai.com/docs/guides/structured-outputs_api-mode=responses

This endpoint allows you to classify input text into predefined moderation categories using a structured output format. You define a JSON schema, and the model attempts to adhere to it when generating the compliance analysis.

```APIDOC
## POST /v1/responses

### Description
This endpoint is used to classify inputs for moderation purposes by leveraging structured outputs. You provide a defined JSON schema, and the model will attempt to categorize the input according to the schema's rules, indicating if it's violating and providing an explanation.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Request Body
- **model** (string) - Required - The ID of the model to use for the moderation task. Example: "gpt-4o-2024-08-06"
- **input** (array of objects) - Required - A list of messages comprising the conversation so far. Each object must have a 'role' and 'content'.
  - **role** (string) - The role of the message's author, e.g., "system", "user".
  - **content** (string) - The content of the message.
- **text.format** (object) - Required - Defines the structured output format the model should adhere to.
  - **type** (string) - Required - Must be "json_schema".
  - **name** (string) - Required - A descriptive name for the schema, e.g., "content_compliance".
  - **description** (string) - Optional - A brief description of what the schema represents.
  - **schema** (object) - Required - The JSON schema definition for the desired output structure.
    - **type** (string) - Must be "object".
    - **properties** (object) - Defines the expected fields in the output.
      - **is_violating** (boolean) - Indicates if the content is violating guidelines.
      - **category** (string or null) - Type of violation, if the content is violating guidelines. Null otherwise. Allowed values: ["violence", "sexual", "self_harm"].
      - **explanation_if_violating** (string or null) - Explanation of why the content is violating.
    - **required** (array of strings) - List of properties that must be present in the output. Example: ["is_violating", "category", "explanation_if_violating"].
    - **additionalProperties** (boolean) - Set to `false` to disallow properties not defined in the schema.
  - **strict** (boolean) - Optional - If `true`, the model will strictly adhere to the schema.

### Request Example
```json
{
  "model": "gpt-4o-2024-08-06",
  "input": [
    {
      "role": "system",
      "content": "Determine if the user input violates specific guidelines and explain if they do."
    },
    {
      "role": "user",
      "content": "How do I prepare for a job interview?"
    }
  ],
  "text": {
    "format": {
      "type": "json_schema",
      "name": "content_compliance",
      "description": "Determines if content is violating specific moderation rules",
      "schema": {
        "type": "object",
        "properties": {
          "is_violating": {
            "type": "boolean",
            "description": "Indicates if the content is violating guidelines"
          },
          "category": {
            "type": ["string", "null"],
            "description": "Type of violation, if the content is violating guidelines. Null otherwise.",
            "enum": ["violence", "sexual", "self_harm"]
          },
          "explanation_if_violating": {
            "type": ["string", "null"],
            "description": "Explanation of why the content is violating"
          }
        },
        "required": ["is_violating", "category", "explanation_if_violating"],
        "additionalProperties": false
      },
      "strict": true
    }
  }
}
```

### Response
#### Success Response (200)
The response will be a JSON object adhering to the `text.format.schema` provided in the request.
- **is_violating** (boolean) - Indicates whether the content was found to be violating the specified guidelines.
- **category** (string or null) - The specific category of violation (e.g., "violence", "sexual") if `is_violating` is true; otherwise, `null`.
- **explanation_if_violating** (string or null) - A detailed explanation of why the content is considered violating if `is_violating` is true; otherwise, `null`.

#### Response Example
```json
{
  "is_violating": false,
  "category": null,
  "explanation_if_violating": null
}
```
```

--------------------------------

### Generate Chain-of-Thought Math Tutoring with OpenAI Structured Outputs using Zod in Python

Source: https://platform.openai.com/docs/guides/structured-outputs_context=with_parse

This Python example demonstrates using OpenAI's Structured Outputs with Zod for generating a step-by-step math tutoring explanation. It defines a Zod schema for mathematical reasoning, then calls the chat completions API with `response_format` set to `zodResponseFormat` to ensure the output adheres to the defined structure. It requires the `openai` and `zod` libraries.

```python
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const completion = await openai.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are a helpful math tutor. Guide the user through the solution step by step." },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  response_format: zodResponseFormat(MathReasoning, "math_reasoning"),
});

const math_reasoning = completion.choices[0].message.parsed;
```

--------------------------------

### Generate Chain-of-Thought Math Tutoring with OpenAI Structured Outputs

Source: https://platform.openai.com/docs/guides/structured-outputs

Demonstrates how to use OpenAI's Structured Outputs to generate step-by-step math tutoring explanations, ensuring the output adheres to a predefined schema. This functionality is showcased with JavaScript (using Zod for schema definition), Python (using Pydantic for schema definition), and a direct cURL API call to the Responses API, along with an example JSON response.

```javascript
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
});

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
});

const response = await openai.responses.parse({
  model: "gpt-4o-2024-08-06",
  input: [
    {
      role: "system",
      content:
        "You are a helpful math tutor. Guide the user through the solution step by step.",
    },
    { role: "user", content: "how can I solve 8x + 7 = -23" },
  ],
  text: {
    format: zodTextFormat(MathReasoning, "math_reasoning"),
  },
});

const math_reasoning = response.output_parsed;
```

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()

class Step(BaseModel):
    explanation: str
    output: str

class MathReasoning(BaseModel):
    steps: list[Step]
    final_answer: str

response = client.responses.parse(
    model="gpt-4o-2024-08-06",
    input=[
        {
            "role": "system",
            "content": "You are a helpful math tutor. Guide the user through the solution step by step.",
        },
        {"role": "user", "content": "how can I solve 8x + 7 = -23"},
    ],
    text_format=MathReasoning,
)

math_reasoning = response.output_parsed
```

```curl
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-2024-08-06",
    "input": [
      {
        "role": "system",
        "content": "You are a helpful math tutor. Guide the user through the solution step by step."
      },
      {
        "role": "user",
        "content": "how can I solve 8x + 7 = -23"
      }
    ],
    "text": {
      "format": {
        "type": "json_schema",
        "name": "math_reasoning",
        "schema": {
          "type": "object",
          "properties": {
            "steps": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "explanation": { "type": "string" },
                  "output": { "type": "string" }
                },
                "required": ["explanation", "output"],
                "additionalProperties": false
              }
            },
            "final_answer": { "type": "string" }
          },
          "required": ["steps", "final_answer"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  }'
```

```json
{
  "steps": [
    {
      "explanation": "Start with the equation 8x + 7 = -23.",
      "output": "8x + 7 = -23"
    },
    {
      "explanation": "Subtract 7 from both sides to isolate the term with the variable.",
      "output": "8x = -23 - 7"
    },
    {
      "explanation": "Simplify the right side of the equation.",
      "output": "8x = -30"
    },
    {
      "explanation": "Divide both sides by 8 to solve for x.",
      "output": "x = -30 / 8"
    },
    {
      "explanation": "Simplify the fraction.",
      "output": "x = -15 / 4"
    }
  ],
  "final_answer": "x = -15 / 4"
}
```

--------------------------------

### POST /v1/responses - Structured Data Extraction

Source: https://platform.openai.com/docs/guides/structured-outputs_api-mode=responses

This endpoint enables the extraction of structured data from arbitrary unstructured text. Users define a JSON schema for the desired output, and the API leverages a specified AI model to parse the input and return data conforming to that structure.

```APIDOC
## POST /v1/responses

### Description
This endpoint facilitates structured data extraction from unstructured input. It takes a text input along with a desired JSON schema for the output and uses an AI model to parse and return the data in the specified format.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Path Parameters
_None_

#### Query Parameters
_None_

#### Request Body
- **model** (string) - Required - The ID of the model to use for the extraction (e.g., "gpt-4o-2024-08-06").
- **input** (array of objects) - Required - A list of messages defining the context for the extraction.
  - **role** (string) - Required - The role of the messages author (e.g., "system", "user").
  - **content** (string) - Required - The content of the message.
- **text** (object) - Required - Configuration for text-based structured outputs.
  - **format** (object) - Required - Specifies the format for the structured output.
    - **type** (string) - Required - Must be "json_schema".
    - **name** (string) - Required - A name for the schema (e.g., "research_paper_extraction").
    - **schema** (object) - Required - The JSON schema defining the desired output structure.
      - **type** (string) - Required - The JSON schema type, typically "object".
      - **properties** (object) - Required - Defines the properties of the output object.
        - **title** (object) - Required - `{ "type": "string" }`
        - **authors** (object) - Required - `{ "type": "array", "items": { "type": "string" } }`
        - **abstract** (object) - Required - `{ "type": "string" }`
        - **keywords** (object) - Required - `{ "type": "array", "items": { "type": "string" } }`
      - **required** (array of strings) - Required - List of required fields from the `properties` (e.g., `["title", "authors", "abstract", "keywords"]`).
      - **additionalProperties** (boolean) - Optional - Whether additional properties are allowed in the output (e.g., `false`).
    - **strict** (boolean) - Optional - Whether to enforce strict schema validation (`true` or `false`).

### Request Example
```json
{
  "model": "gpt-4o-2024-08-06",
  "input": [
    {
      "role": "system",
      "content": "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure."
    },
    {
      "role": "user",
      "content": "The Impact of Quantum Computing on Cryptography. By A. Turing, E. Noether. Abstract: This paper explores the profound effects of quantum computing on modern cryptographic systems... Keywords: Quantum, Cryptography, Security, Post-Quantum."
    }
  ],
  "text": {
    "format": {
      "type": "json_schema",
      "name": "research_paper_extraction",
      "schema": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "authors": {
            "type": "array",
            "items": { "type": "string" }
          },
          "abstract": { "type": "string" },
          "keywords": {
            "type": "array",
            "items": { "type": "string" }
          }
        },
        "required": ["title", "authors", "abstract", "keywords"],
        "additionalProperties": false
      },
      "strict": true
    }
  }
}
```

### Response
#### Success Response (200)
- **output_parsed** (object) - The parsed structured data according to the provided schema.
  - **title** (string) - The title of the research paper.
  - **authors** (array of strings) - List of authors of the paper.
  - **abstract** (string) - The abstract content of the paper.
  - **keywords** (array of strings) - A list of keywords associated with the paper.

#### Response Example
```json
{
  "title": "Application of Quantum Algorithms in Interstellar Navigation: A New Frontier",
  "authors": [
    "Dr. Stella Voyager",
    "Dr. Nova Star",
    "Dr. Lyra Hunter"
  ],
  "abstract": "This paper investigates the utilization of quantum algorithms to improve interstellar navigation systems. By leveraging quantum superposition and entanglement, our proposed navigation system can calculate optimal travel paths through space-time anomalies more efficiently than classical methods. Experimental simulations suggest a significant reduction in travel time and fuel consumption for interstellar missions.",
  "keywords": [
    "Quantum algorithms",
    "interstellar navigation",
    "space-time anomalies",
    "quantum superposition",
    "quantum entanglement",
    "space travel"
  ]
}
```
```

--------------------------------

### Prepare Pydantic Model for Structured Output Parsing (Python)

Source: https://platform.openai.com/docs/guides/structured-outputs_context=with_parse

This Python snippet illustrates the initial setup for defining a Pydantic model to parse structured outputs. By importing `BaseModel` and `ValidationError`, it lays the groundwork for creating a type-safe representation of the JSON schema received from the OpenAI API, facilitating robust data handling and validation.

```python
from pydantic import BaseModel, ValidationError
from typing import List
```

--------------------------------

### Define structured output types and parse OpenAI response (Python & TypeScript)

Source: https://platform.openai.com/docs/guides/structured-outputs_api-mode=chat

This snippet demonstrates how to define expected data structures for OpenAI API responses. It includes Python examples using Pydantic models for validation and parsing, and TypeScript examples for defining type-safe structures and parsing the JSON response. These types ensure the API output conforms to a predefined schema.

```python
class Step(BaseModel):
    explanation: str
    output: str

class Solution(BaseModel):
    steps: List[Step]
    final_answer: str

try:
    # Parse and validate the response content
    solution = Solution.parse_raw(response.choices[0].message.content)
    print(solution)
except ValidationError as e:
    # Handle validation errors
    print(e.json())
```

```typescript
type Step = {
  explanation: string;
  output: string;
};

type Solution = {
  steps: Step[];
  final_answer: string;
};

const solution = JSON.parse(response.choices[0].message.content)) as Solution
```

--------------------------------

### Generate Chain-of-Thought Math Tutoring with OpenAI Structured Outputs via cURL

Source: https://platform.openai.com/docs/guides/structured-outputs_context=with_parse

This cURL example demonstrates how to use OpenAI's Structured Outputs to generate a step-by-step math tutoring explanation. It sends a POST request to the chat completions API, defining a `json_schema` directly in the `response_format` to enforce the desired output structure. This method allows for API interaction without client libraries.

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-2024-08-06",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful math tutor. Guide the user through the solution step by step."
      },
      {
        "role": "user",
        "content": "how can I solve 8x + 7 = -23"
      }
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "math_reasoning",
        "schema": {
          "type": "object",
          "properties": {
            "steps": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "explanation": { "type": "string" },
                  "output": { "type": "string" }
                },
                "required": ["explanation", "output"],
                "additionalProperties": false
              }
            },
            "final_answer": { "type": "string" }
          },
          "required": ["steps", "final_answer"],
          "additionalProperties": false
        },
        "strict": true
      }
    }
  }'
```

--------------------------------

### Generate Chain-of-Thought Math Tutoring with OpenAI Structured Outputs using Pydantic in Python

Source: https://platform.openai.com/docs/guides/structured-outputs_context=with_parse

This Python example demonstrates using OpenAI's Structured Outputs with Pydantic for generating a step-by-step math tutoring explanation. It defines Pydantic models for mathematical reasoning, then calls the chat completions API with `response_format` set to the Pydantic model to ensure the output adheres to the defined structure. It requires the `openai` and `pydantic` libraries.

```python
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI()

class Step(BaseModel):
    explanation: str
    output: str

class MathReasoning(BaseModel):
    steps: list[Step]
    final_answer: str

completion = client.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "You are a helpful math tutor. Guide the user through the solution step by step."},
        {"role": "user", "content": "how can I solve 8x + 7 = -23"}
    ],
    response_format=MathReasoning,
)

math_reasoning = completion.choices[0].message.parsed
```

--------------------------------

### Handle OpenAI Model Refusal with Structured Output (Python)

Source: https://platform.openai.com/docs/guides/structured-outputs_api-mode=responses

This Python example demonstrates how to define a structured output schema using Pydantic and interact with the OpenAI API. It includes conditional logic to check for a 'refusal' property in the model's response, printing the refusal message if the model declines the request or the parsed structured output otherwise. This ensures robust handling of safety-related content moderation.

```python
class Step(BaseModel):
    explanation: str
    output: str

class MathReasoning(BaseModel):
    steps: list[Step]
    final_answer: str

completion = client.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "You are a helpful math tutor. Guide the user through the solution step by step."},
        {"role": "user", "content": "how can I solve 8x + 7 = -23"}
    ],
    response_format=MathReasoning,
)

math_reasoning = completion.choices[0].message

# If the model refuses to respond, you will get a refusal message

if (math_reasoning.refusal):
    print(math_reasoning.refusal)
else:
    print(math_reasoning.parsed)
```

--------------------------------

### POST /v1/chat/completions - Structured Outputs (Chain of Thought)

Source: https://platform.openai.com/docs/guides/structured-outputs_context=with_parse

This endpoint allows making chat completion requests to OpenAI models, specifically utilizing Structured Outputs to enforce a predefined JSON schema for the model's response. This example demonstrates a 'chain of thought' math tutoring scenario where the model provides a step-by-step solution structured according to a defined schema.

```APIDOC
## POST /v1/chat/completions

### Description
This endpoint facilitates requesting chat completions from OpenAI models while enforcing a strict output structure using JSON Schema. It's ideal for use cases requiring predictable and validated JSON responses, such as extracting structured data or generating multi-step explanations. The example illustrates a math tutoring scenario where the model breaks down a problem into explanatory steps and a final answer, all conforming to a predefined schema.

### Method
POST

### Endpoint
`/v1/chat/completions`

### Parameters
#### Request Body
- **model** (string) - Required - The ID of the model to use for this request. E.g., `gpt-4o-2024-08-06`.
- **messages** (array of objects) - Required - A list of messages comprising the conversation.
  - **role** (string) - Required - The role of the author of this message (e.g., "system", "user").
  - **content** (string) - Required - The content of the message.
- **response_format** (object) - Required - An object specifying the format of the output.
  - **type** (string) - Required - Must be "json_schema" for Structured Outputs.
  - **json_schema** (object) - Required - The JSON schema definition.
    - **name** (string) - Optional - A name for the schema (e.g., "math_reasoning").
    - **schema** (object) - Required - The actual JSON schema definition.
      - **type** (string) - Required - The type of the root JSON element (e.g., "object").
      - **properties** (object) - Required - Defines the properties of the JSON object.
        - **steps** (object) - Required - Defines an array of steps.
          - **type** (string) - "array"
          - **items** (object) - Defines the structure of each item in the `steps` array.
            - **type** (string) - "object"
            - **properties** (object)
              - **explanation** (object) - `type: "string"`
              - **output** (object) - `type: "string"`
            - **required** (array of strings) - `["explanation", "output"]`
            - **additionalProperties** (boolean) - `false`
        - **final_answer** (object) - `type: "string"`
      - **required** (array of strings) - `["steps", "final_answer"]`
      - **additionalProperties** (boolean) - `false`
    - **strict** (boolean) - Required - If `true`, enforces strict adherence to the schema, disallowing additional properties or properties with incorrect types.

### Request Example
```json
{
  "model": "gpt-4o-2024-08-06",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful math tutor. Guide the user through the solution step by step."
    },
    {
      "role": "user",
      "content": "how can I solve 8x + 7 = -23"
    }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "math_reasoning",
      "schema": {
        "type": "object",
        "properties": {
          "steps": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "explanation": { "type": "string" },
                "output": { "type": "string" }
              },
              "required": ["explanation", "output"],
              "additionalProperties": false
            }
          },
          "final_answer": { "type": "string" }
        },
        "required": ["steps", "final_answer"],
        "additionalProperties": false
      },
      "strict": true
    }
  }
}
```

### Response
#### Success Response (200)
- **id** (string) - The ID of the completion.
- **object** (string) - The object type, which is `chat.completion`.
- **created** (integer) - The Unix timestamp (in seconds) of when the completion was created.
- **model** (string) - The model used for the completion.
- **choices** (array of objects) - A list of chat completion choices.
  - **index** (integer) - The index of the choice in the list.
  - **message** (object) - The message content produced by the model.
    - **role** (string) - The role of the author of this message, which is `assistant`.
    - **content** (string) - The full raw JSON string content from the model, before parsing.
    - **parsed** (object) - The parsed JSON object adhering to the defined schema (only available when using client libraries with `parse` method).
      - **steps** (array of objects) - A list of detailed steps for the chain of thought.
        - **explanation** (string) - A textual explanation for the current step.
        - **output** (string) - The mathematical output or intermediate result for the current step.
      - **final_answer** (string) - The ultimate solution or final answer to the problem.
- **usage** (object) - Information about the API request's resource usage.

#### Response Example
```json
{
  "steps": [
    {
      "explanation": "Start with the equation 8x + 7 = -23.",
      "output": "8x + 7 = -23"
    },
    {
      "explanation": "Subtract 7 from both sides to isolate the term with the variable.",
      "output": "8x = -23 - 7"
    },
    {
      "explanation": "Simplify the right side of the equation.",
      "output": "8x = -30"
    },
    {
      "explanation": "Divide both sides by 8 to solve for x.",
      "output": "x = -30 / 8"
    },
    {
      "explanation": "Simplify the fraction.",
      "output": "x = -15 / 4"
    }
  ],
  "final_answer": "x = -15 / 4"
}
```
```

--------------------------------

### Stream Structured Output from OpenAI Models

Source: https://platform.openai.com/docs/guides/structured-outputs

These examples demonstrate how to stream structured output from OpenAI models (e.g., gpt-4.1) using their respective SDKs. Both Python and TypeScript examples define a schema for the expected output (using Pydantic and Zod, respectively) and process the streamed events incrementally, handling delta updates, refusals, and errors, before retrieving the final parsed response.

```python
from typing import List

from openai import OpenAI
from pydantic import BaseModel

class EntitiesModel(BaseModel):
    attributes: List[str]
    colors: List[str]
    animals: List[str]

client = OpenAI()

with client.responses.stream(
    model="gpt-4.1",
    input=[
        {"role": "system", "content": "Extract entities from the input text"},
        {
            "role": "user",
            "content": "The quick brown fox jumps over the lazy dog with piercing blue eyes",
        },
    ],
    text_format=EntitiesModel,
) as stream:
    for event in stream:
        if event.type == "response.refusal.delta":
            print(event.delta, end="")
        elif event.type == "response.output_text.delta":
            print(event.delta, end="")
        elif event.type == "response.error":
            print(event.error, end="")
        elif event.type == "response.completed":
            print("Completed")
            # print(event.response.output)

    final_response = stream.get_final_response()
    print(final_response)
```

```typescript
import { OpenAI } from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const EntitiesSchema = z.object({
  attributes: z.array(z.string()),
  colors: z.array(z.string()),
  animals: z.array(z.string()),
});

const openai = new OpenAI();
const stream = openai.responses
  .stream({
    model: "gpt-4.1",
    input: [
      { role: "user", content: "What's the weather like in Paris today?" },
    ],
    text: {
      format: zodTextFormat(EntitiesSchema, "entities"),
    },
  })
  .on("response.refusal.delta", (event) => {
    process.stdout.write(event.delta);
  })
  .on("response.output_text.delta", (event) => {
    process.stdout.write(event.delta);
  })
  .on("response.output_text.done", () => {
    process.stdout.write("\n");
  })
  .on("response.error", (event) => {
    console.error(event.error);
  });

const result = await stream.finalResponse();

console.log(result);
```
