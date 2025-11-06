### Example Accumulated Function Call Object (JSON)

Source: https://platform.openai.com/docs/guides/function-calling

This JSON object illustrates the structure of a single function call accumulated from a stream. It includes the call's type, unique IDs, name of the function, and its arguments as a JSON string.

```json
{
    "type": "function_call",
    "id": "fc_1234xyz",
    "call_id": "call_2345abc",
    "name": "get_weather",
    "arguments": "{\"location\":\"Paris, France\"}"
}
```

--------------------------------

### Execute and Capture OpenAI Function Call Results

Source: https://platform.openai.com/docs/guides/function-calling

These code snippets demonstrate how to iterate through an OpenAI model's response to identify and execute function calls. For each function call, arguments are parsed, the function is executed, and its result is formatted and appended to the input messages for subsequent model interaction, identified by its "call_id".

```python
for tool_call in response.output:
    if tool_call.type != "function_call":
        continue

    name = tool_call.name
    args = json.loads(tool_call.arguments)

    result = call_function(name, args)
    input_messages.append({
        "type": "function_call_output",
        "call_id": tool_call.call_id,
        "output": str(result)
    })
```

```javascript
for (const toolCall of response.output) {
    if (toolCall.type !== "function_call") {
        continue;
    }

    const name = toolCall.name;
    const args = JSON.parse(toolCall.arguments);

    const result = callFunction(name, args);
    input.push({
        type: "function_call_output",
        call_id: toolCall.call_id,
        output: result.toString()
    });
}
```

--------------------------------

### Begin Accumulating Streaming Function Call Argument Deltas (Python)

Source: https://platform.openai.com/docs/guides/function-calling

This Python snippet demonstrates the initial setup for accumulating `delta` events from an OpenAI streaming function call. It initializes a `final_tool_calls` dictionary to store the reconstructed function calls and begins iterating through the stream. The code shows how to identify and process `response.output_item.added` events, which signify the start of a new function call.

```python
final_tool_calls = {}

for event in stream:
    if event.type === 'response.output_item.added':
```

--------------------------------

### Execute and Append Function Call Results

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

Guides on iterating through model's `tool_calls`, executing functions, and formatting results for the next model turn.

```APIDOC
## Execute and Append Function Call Results

### Description
After receiving `tool_calls` from the AI model, you must execute the suggested functions and append their results back to the conversation `messages`. This prepares the context for the next turn, allowing the model to incorporate the function output.

### Method
N/A (This describes an application-side processing step.)

### Endpoint
N/A

### Parameters
#### Input from AI Model
- **completion.choices[0].message.tool_calls** (array) - A list of function calls suggested by the AI model, as described in the "AI Model Function Call Response Format" section.

### Request Example
#### Python
```python
for tool_call in completion.choices[0].message.tool_calls:
    name = tool_call.function.name
    args = json.loads(tool_call.function.arguments)

    result = call_function(name, args) # call_function is a hypothetical function router
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": str(result)
    })
```

#### JavaScript
```javascript
for (const toolCall of completion.choices[0].message.tool_calls) {
    const name = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    const result = callFunction(name, args); // callFunction is a hypothetical function router
    messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result.toString()
    });
}
```

### Response
The `messages` array is updated with new entries where `role` is "tool", `tool_call_id` matches the original tool call, and `content` contains the stringified result of the function execution. This updated `messages` array is then sent back to the AI model.
```

--------------------------------

### OpenAI Model Response with Multiple Function Calls

Source: https://platform.openai.com/docs/guides/function-calling

This JSON array illustrates a typical OpenAI model response containing multiple distinct function call objects. Each object specifies a unique "call_id", the function "name" to be executed, and "arguments" as a JSON-encoded string, which must be parsed before execution.

```json
[
    {
        "id": "fc_12345xyz",
        "call_id": "call_12345xyz",
        "type": "function_call",
        "name": "get_weather",
        "arguments": "{\"location\":\"Paris, France\"}"
    },
    {
        "id": "fc_67890abc",
        "call_id": "call_67890abc",
        "type": "function_call",
        "name": "get_weather",
        "arguments": "{\"location\":\"Bogotá, Colombia\"}"
    },
    {
        "id": "fc_99999def",
        "call_id": "call_99999def",
        "type": "function_call",
        "name": "send_email",
        "arguments": "{\"to\":\"bob@email.com\",\"body\":\"Hi bob\"}"
    }
]
```

--------------------------------

### Sample OpenAI Model Response with Multiple Function Calls (JSON)

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

This JSON object illustrates a typical response from an OpenAI model when it decides to call one or more functions. It contains an array of 'tool_calls', each specifying a unique 'id', type, and a 'function' object with a 'name' and JSON-encoded 'arguments' for the function to be executed.

```json
[
    {
        "id": "call_12345xyz",
        "type": "function",
        "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Paris, France\"}"
        }
    },
    {
        "id": "call_67890abc",
        "type": "function",
        "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Bogotá, Colombia\"}"
        }
    },
    {
        "id": "call_99999def",
        "type": "function",
        "function": {
            "name": "send_email",
            "arguments": "{\"to\":\"bob@email.com\",\"body\":\"Hi bob\"}"
        }
    }
]
```

--------------------------------

### Stream OpenAI function calls and print deltas (Python, JavaScript)

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

This snippet demonstrates how to initiate a streaming chat completion with OpenAI, including a function tool definition. It then iterates through the incoming stream chunks, printing the `delta.tool_calls` as they are received. This shows the fragmented nature of streamed function call arguments.

```python
from openai import OpenAI

client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current temperature for a given location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and country e.g. Bogotá, Colombia"
                }
            },
            "required": ["location"],
            "additionalProperties": False
        },
        "strict": True
    }
}]

stream = client.chat.completions.create(
    model="gpt-4.1",
    messages=[{"role": "user", "content": "What's the weather like in Paris today?"}],
    tools=tools,
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta
    print(delta.tool_calls)
```

```javascript
import { OpenAI } from "openai";

const openai = new OpenAI();

const tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current temperature for a given location.",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and country e.g. Bogotá, Colombia"
                }
            },
            "required": ["location"],
            "additionalProperties": false
        },
        "strict": true
    }
}];

const stream = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: "What's the weather like in Paris today?" }],
    tools,
    stream: true,
    store: true,
});

for await (const chunk of stream) {
    const delta = chunk.choices[0].delta;
    console.log(delta.tool_calls);
}
```

--------------------------------

### Implement Helper to Route OpenAI Function Calls

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

This snippet provides a possible implementation for a 'call_function' (or 'callFunction') utility. It acts as a router, dispatching to specific application-defined functions (e.g., 'get_weather', 'send_email') based on the function name provided by the model, passing the parsed arguments accordingly.

```python
def call_function(name, args):
    if name == "get_weather":
        return get_weather(**args)
    if name == "send_email":
        return send_email(**args)
```

```javascript
const callFunction = async (name, args) => {
    if (name === "get_weather") {
        return getWeather(args.latitude, args.longitude);
    }
    if (name === "send_email") {
        return sendEmail(args.to, args.body);
    }
};
```

--------------------------------

### Implement OpenAI Tool Calling for Function Execution

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=responses

This example demonstrates the end-to-end process of integrating and using callable tools with OpenAI models across Python and JavaScript. It covers defining a tool with its schema, simulating a model's function call, executing the corresponding custom function (e.g., 'get_horoscope'), and then feeding the function's output back to the model for a final, context-aware response. The process involves multiple turns of interaction with the model.

```python
tools = [
    {
        "type": "function",
        "name": "get_horoscope",
        "description": "Get today's horoscope for an astrological sign.",
        "parameters": {
            "type": "object",
            "properties": {
                "sign": {
                    "type": "string",
                    "description": "An astrological sign like Taurus or Aquarius",
                },
            },
            "required": ["sign"],
        },
    },
]

def get_horoscope(sign):
    return f"{sign}: Next Tuesday you will befriend a baby otter."

# Create a running input list we will add to over time
input_list = [
    {"role": "user", "content": "What is my horoscope? I am an Aquarius."}
]

# 2. Prompt the model with tools defined
response = client.responses.create(
    model="gpt-5",
    tools=tools,
    input=input_list,
)

# Save function call outputs for subsequent requests
input_list += response.output

for item in response.output:
    if item.type == "function_call":
        if item.name == "get_horoscope":
            # 3. Execute the function logic for get_horoscope
            horoscope = get_horoscope(json.loads(item.arguments))

            # 4. Provide function call results to the model
            input_list.append({
                "type": "function_call_output",
                "call_id": item.call_id,
                "output": json.dumps({
                  "horoscope": horoscope
                })
            })

print("Final input:")
print(input_list)

response = client.responses.create(
    model="gpt-5",
    instructions="Respond only with a horoscope generated by a tool.",
    tools=tools,
    input=input_list,
)

# 5. The model should be able to give a response!
print("Final output:")
print(response.model_dump_json(indent=2))
print("\n" + response.output_text)
```

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

// 1. Define a list of callable tools for the model
const tools = [
  {
    type: "function",
    name: "get_horoscope",
    description: "Get today's horoscope for an astrological sign.",
    parameters: {
      type: "object",
      properties: {
        sign: {
          type: "string",
          description: "An astrological sign like Taurus or Aquarius",
        },
      },
      required: ["sign"],
    },
  },
];

function getHoroscope(sign) {
  return sign + " Next Tuesday you will befriend a baby otter.";
}

// Create a running input list we will add to over time
let input = [
  { role: "user", content: "What is my horoscope? I am an Aquarius." },
];

// 2. Prompt the model with tools defined
let response = await openai.responses.create({
  model: "gpt-5",
  tools,
  input,
});

response.output.forEach((item) => {
  if (item.type == "function_call") {
    if (item.name == "get_horoscope"):
      const horoscope = getHoroscope(JSON.parse(item.arguments))

      input_list.push({
          type: "function_call_output",
          call_id: item.call_id,
          output: json.dumps({
            horoscope
          })
      })
  }
});

console.log("Final input:");
console.log(JSON.stringify(input, null, 2));

response = await openai.responses.create({
  model: "gpt-5",
  instructions: "Respond only with a horoscope generated by a tool.",
  tools,
  input,
});

// 5. The model should be able to give a response!
console.log("Final output:");
console.log(JSON.stringify(response.output, null, 2));
```

--------------------------------

### Define Functions as Tools for OpenAI Assistant (Python, JavaScript)

Source: https://platform.openai.com/docs/assistants/tools/function-calling

This snippet demonstrates how to define external functions as tools for an OpenAI Assistant. It includes examples for `get_current_temperature` and `get_rain_probability`, specifying their names, descriptions, and required parameters, allowing the Assistant to understand and call these functions intelligently when created.

```python
from openai import OpenAI
client = OpenAI()

assistant = client.beta.assistants.create(
  instructions="You are a weather bot. Use the provided functions to answer questions.",
  model="gpt-4o",
  tools=[
    {
      "type": "function",
      "function": {
        "name": "get_current_temperature",
        "description": "Get the current temperature for a specific location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g., San Francisco, CA"
            },
            "unit": {
              "type": "string",
              "enum": ["Celsius", "Fahrenheit"],
              "description": "The temperature unit to use. Infer this from the user's location."
            }
          },
          "required": ["location", "unit"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_rain_probability",
        "description": "Get the probability of rain for a specific location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g., San Francisco, CA"
            }
          },
          "required": ["location"]
        }
      }
    }
  ]
)
```

```javascript
const assistant = await client.beta.assistants.create({
  model: "gpt-4o",
  instructions:
    "You are a weather bot. Use the provided functions to answer questions.",
  tools: [
    {
      type: "function",
      function: {
        name: "getCurrentTemperature",
        description: "Get the current temperature for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g., San Francisco, CA",
            },
            unit: {
              type: "string",
              enum: ["Celsius", "Fahrenheit"],
              description:
                "The temperature unit to use. Infer this from the user's location.",
            },
          },
          required: ["location", "unit"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getRainProbability",
        description: "Get the probability of rain for a specific location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g., San Francisco, CA",
            },
          },
          required: ["location"],
        },
      },
    },
  ],
});
```

--------------------------------

### Send Function Results Back to AI Model

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

Illustrates how to send the processed function call results back to the AI model to continue the conversation.

```APIDOC
## Send Function Results Back to AI Model

### Description
After executing the functions and appending their results to the `messages` array, the updated conversation history (including the function results) is sent back to the AI model. This allows the model to process the results and generate a final, informed response.

### Method
N/A (This describes an SDK call to the AI model API.)

### Endpoint
N/A

### Parameters
- **model** (string) - The identifier of the AI model to use (e.g., "gpt-4.1").
- **messages** (array) - The conversation history, including the initial user message, the model's function call suggestion, and the appended function results.
- **tools** (array) - (Optional) The list of tools/functions available to the model, defined in the initial request.

### Request Example
#### Python
```python
completion = client.chat.completions.create(
    model="gpt-4.1",
    messages=messages,
    tools=tools,
)
```

#### JavaScript
```javascript
const completion = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages,
    tools,
    store: true,
});
```

### Response
#### Final AI Model Response
The AI model returns a completion that incorporates the function results. This is often a natural language response summarizing the actions taken and their outcomes.

#### Response Example
```
"It's about 15°C in Paris, 18°C in Bogotá, and I've sent that email to Bob."
```
```

--------------------------------

### Stream OpenAI Function Calls with `stream=True` (Python, JavaScript)

Source: https://platform.openai.com/docs/guides/function-calling

This code demonstrates how to initiate a streaming function call to an OpenAI model using the `stream=True` parameter. It defines a 'get_weather' tool with specified parameters and sends a user query. The example then iterates through the stream events, printing each one as it arrives, showcasing real-time progress of the model filling its arguments.

```python
from openai import OpenAI

client = OpenAI()

tools = [{
    "type": "function",
    "name": "get_weather",
    "description": "Get current temperature for a given location.",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "City and country e.g. Bogotá, Colombia"
            }
        },
        "required": [
            "location"
        ],
        "additionalProperties": False
    }
}]

stream = client.responses.create(
    model="gpt-4.1",
    input=[{"role": "user", "content": "What's the weather like in Paris today?"}],
    tools=tools,
    stream=True
)

for event in stream:
    print(event)
```

```javascript
import { OpenAI } from "openai";

const openai = new OpenAI();

const tools = [{
    type: "function",
    name: "get_weather",
    description: "Get current temperature for provided coordinates in celsius.",
    parameters: {
        type: "object",
        properties: {
            latitude: { type: "number" },
            longitude: { type: "number" }
        },
        required: ["latitude", "longitude"],
        additionalProperties: false
    },
    strict: true
}];

const stream = await openai.responses.create({
    model: "gpt-4.1",
    input: [{ role: "user", content: "What's the weather like in Paris today?" }],
    tools,
    stream: true,
    store: true,
});

for await (const event of stream) {
    console.log(event)
}
```

--------------------------------

### Iterate, Execute, and Append OpenAI Function Call Results

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

This code snippet demonstrates how to parse a model's 'tool_calls' array, extract function names and arguments, execute the corresponding functions using a helper utility, and then format and append the results back into the conversation 'messages' as 'tool' role messages with the original 'tool_call_id'.

```python
for tool_call in completion.choices[0].message.tool_calls:
    name = tool_call.function.name
    args = json.loads(tool_call.function.arguments)

    result = call_function(name, args)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": str(result)
    })
```

```javascript
for (const toolCall of completion.choices[0].message.tool_calls) {
    const name = toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);

    const result = callFunction(name, args);
    messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result.toString()
    });
}
```

--------------------------------

### Example of OpenAI Final Response with Function Results

Source: https://platform.openai.com/docs/guides/function-calling

This string represents a final natural language response from the OpenAI model. It demonstrates how the model integrates the information gained from the executed function calls (weather data and email confirmation) into a coherent and contextually relevant output.

```text
"It's about 15°C in Paris, 18°C in Bogotá, and I've sent that email to Bob."
```

--------------------------------

### Interpret OpenAI Streaming Function Call Output Events (JSON)

Source: https://platform.openai.com/docs/guides/function-calling

This JSON output demonstrates the event structure received during an OpenAI streaming function call. It shows `response.output_item.added` for initial function call identification, followed by `response.function_call_arguments.delta` events incrementally building the `arguments` string, and concluding with `response.output_item.done` containing the finalized function call and its complete arguments.

```json
{"type":"response.output_item.added","response_id":"resp_1234xyz","output_index":0,"item":{"type":"function_call","id":"fc_1234xyz","call_id":"call_1234xyz","name":"get_weather","arguments":""}}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"{\""}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"location"}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"\":\""}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"Paris"}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":","}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":" France"}
{"type":"response.function_call_arguments.delta","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"delta":"\"}"}
{"type":"response.function_call_arguments.done","response_id":"resp_1234xyz","item_id":"fc_1234xyz","output_index":0,"arguments":"{\"location\":\"Paris, France\"}"}
{"type":"response.output_item.done","response_id":"resp_1234xyz","output_index":0,"item":{"type":"function_call","id":"fc_1234xyz","call_id":"call_1234xyz","name":"get_weather","arguments":"{\"location\":\"Paris, France\"}"}}
```

--------------------------------

### AI Model Function Call Response Format

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

Describes the structure of the `tool_calls` array received from the AI model when it suggests one or more functions to be executed.

```APIDOC
## AI Model Function Call Response Format

### Description
When the AI model determines that a function needs to be called, its response will include a list of `tool_calls`. Each tool call contains an `id`, `type`, and a `function` object which specifies the `name` of the function to be called and its `arguments` as a JSON-encoded string.

### Method
N/A (This describes a data structure received from the AI model, not an API call.)

### Endpoint
N/A

### Response
This describes the `tool_calls` array that is part of the AI model's response message.
- **id** (string) - Unique identifier for the tool call. This ID is used later when submitting the function's result back to the model.
- **type** (string) - The type of tool call, which is typically "function".
- **function** (object) - Contains details about the function to be executed.
    - **name** (string) - The name of the function that the model wants to call.
    - **arguments** (string) - A JSON-encoded string representing the arguments for the specified function.

### Response Example
```json
[
    {
        "id": "call_12345xyz",
        "type": "function",
        "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Paris, France\"}"
        }
    },
    {
        "id": "call_67890abc",
        "type": "function",
        "function": {
            "name": "get_weather",
            "arguments": "{\"location\":\"Bogotá, Colombia\"}"
        }
    },
    {
        "id": "call_99999def",
        "type": "function",
        "function": {
            "name": "send_email",
            "arguments": "{\"to\":\"bob@email.com\",\"body\":\"Hi bob\"}"
        }
    }
]
```
```

--------------------------------

### OpenAI Streaming Function Calls Events

Source: https://platform.openai.com/docs/guides/function-calling

This section describes the structure of events emitted by the OpenAI API when streaming function calls, detailing the `response.output_item.added` and `response.function_call_arguments.delta` event types.

```APIDOC
## OpenAI Streaming Function Calls Events

### Description
This section describes the structure of events emitted by the OpenAI API when streaming function calls, detailing the `response.output_item.added` and `response.function_call_arguments.delta` event types.

### Method
Not directly applicable as this describes output events from a stream, not a single HTTP endpoint. The underlying operation is typically a POST request to OpenAI's chat completions API.

### Endpoint
Not directly applicable. The events are streamed from OpenAI's chat completions API (e.g., `/v1/chat/completions`).

### Parameters
*(Parameters for the API call that generates these events, not the events themselves)*
#### Request Body
- **model** (string) - Required - The model to use for the chat completion.
- **input** (array of objects) - Required - Messages to send to the model.
- **tools** (array of objects) - Optional - A list of tools the model may call.
    - **type** (string) - Required - Type of the tool, e.g., "function".
    - **function** (object) - Required if type is "function".
        - **name** (string) - Required - The name of the function to be called.
        - **description** (string) - Optional - A description of the function.
        - **parameters** (object) - Required - The parameters the function accepts, described as a JSON Schema object.
- **stream** (boolean) - Required - If true, responses are streamed back as server-sent events.

### Request Example
```json
{
  "model": "gpt-4.1",
  "input": [
    {
      "role": "user",
      "content": "What's the weather like in Paris today?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get current temperature for a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City and country e.g. Bogotá, Colombia"
            }
          },
          "required": [
            "location"
          ]
        }
      }
    }
  ],
  "stream": true
}
```

### Response
#### Streaming Events
The API returns a stream of Server-Sent Events (SSE). Key event types include `response.output_item.added`, `response.function_call_arguments.delta`, and `response.output_item.done`.

##### `response.output_item.added` Event
Emitted when a new function call item is added to the output.
- **type** (string) - "response.output_item.added"
- **response_id** (string) - The ID of the overall response.
- **output_index** (number) - The index of the output item within the response (represents individual function calls).
- **item** (object) - The in-progress function call item.
    - **type** (string) - "function_call"
    - **id** (string) - The ID of the function call.
    - **call_id** (string) - The call ID for the function.
    - **name** (string) - The name of the function being called.
    - **arguments** (string) - Initial (possibly empty) string for arguments.

##### `response.function_call_arguments.delta` Event
Emitted incrementally, containing chunks of the `arguments` JSON object for a function call.
- **type** (string) - "response.function_call_arguments.delta"
- **response_id** (string) - The ID of the overall response.
- **item_id** (string) - The ID of the function call item this delta belongs to.
- **output_index** (number) - The index of the output item within the response.
- **delta** (string) - A partial string representing a chunk of the JSON arguments.

##### `response.function_call_arguments.done` Event
Emitted when the arguments for a function call are complete.
- **type** (string) - "response.function_call_arguments.done"
- **response_id** (string) - The ID of the overall response.
- **item_id** (string) - The ID of the function call item.
- **output_index** (number) - The index of the output item.
- **arguments** (string) - The complete JSON string of the arguments.

##### `response.output_item.done` Event
Emitted when an output item (function call) is complete.
- **type** (string) - "response.output_item.done"
- **response_id** (string) - The ID of the overall response.
- **output_index** (number) - The index of the output item.
- **item** (object) - The completed function call item with final arguments.
    - **type** (string) - "function_call"
    - **id** (string) - The ID of the function call.
    - **call_id** (string) - The call ID for the function.
    - **name** (string) - The name of the function called.
    - **arguments** (string) - The complete JSON string of arguments.

### Response Example
```json
{
  "type":"response.output_item.added",
  "response_id":"resp_1234xyz",
  "output_index":0,
  "item":{
    "type":"function_call",
    "id":"fc_1234xyz",
    "call_id":"call_1234xyz",
    "name":"get_weather",
    "arguments":""
  }
}
{
  "type":"response.function_call_arguments.delta",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "delta":"{\""
}
{
  "type":"response.function_call_arguments.delta",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "delta":"location"
}
{
  "type":"response.function_call_arguments.delta",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "delta":"\":\""
}
{
  "type":"response.function_call_arguments.delta",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "delta":"Paris"
}
{
  "type":"response.function_call_arguments.delta",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "delta":","
}
{
  "type":"response.function_call_arguments.delta",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "delta":" France"
}
{
  "type":"response.function_call_arguments.delta",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "delta":"\"}"
}
{
  "type":"response.function_call_arguments.done",
  "response_id":"resp_1234xyz",
  "item_id":"fc_1234xyz",
  "output_index":0,
  "arguments":"{\"location\":\"Paris, France\"}"
}
{
  "type":"response.output_item.done",
  "response_id":"resp_1234xyz",
  "output_index":0,
  "item":{
    "type":"function_call",
    "id":"fc_1234xyz",
    "call_id":"call_1234xyz",
    "name":"get_weather",
    "arguments":"{\"location\":\"Paris, France\"}"
  }
}
```
```

--------------------------------

### POST /v1/responses - Function Calling

Source: https://platform.openai.com/docs/quickstart

This endpoint allows you to send a user message to an OpenAI model and enable it to call predefined functions based on the input. This example demonstrates how to set up a 'get_weather' function.

```APIDOC
## POST /v1/responses

### Description
This endpoint facilitates communication with an OpenAI model, enabling it to invoke custom functions you define. By providing a function's schema, the model can intelligently decide when and how to call your backend logic, such as fetching real-time data or performing actions.

### Method
POST

### Endpoint
https://api.openai.com/v1/responses

### Parameters
#### Request Body
- **model** (string) - Required - The ID of the model to use (e.g., "gpt-5").
- **input** (array of objects) - Required - A list of message objects representing the conversation so far.
  - **role** (string) - Required - The role of the messages author (e.g., "user", "assistant").
  - **content** (string) - Required - The content of the message.
- **tools** (array of objects) - Optional - A list of tools the model may call. For function calling, one item defines the function.
  - **type** (string) - Required - The type of the tool. Must be "function".
  - **name** (string) - Required - The name of the function to be called by the model.
  - **description** (string) - Optional - A description of what the function does, used by the model to understand when to call it.
  - **parameters** (object) - Required - The parameters the function accepts, described as a JSON Schema object.
    - **type** (string) - Required - Must be "object".
    - **properties** (object) - Required - A map of property names to their JSON Schema definitions.
      - **location** (object) - Required (example) - Definition for the location parameter.
        - **type** (string) - Required - "string"
        - **description** (string) - Required - e.g., "City and country e.g. Bogotá, Colombia"
    - **required** (array of strings) - Optional - A list of parameter names that are required.
    - **additionalProperties** (boolean) - Optional - Specifies whether the function accepts additional, undeclared properties.
  - **strict** (boolean) - Optional - Whether strict mode is enabled for this function call.

### Request Example
```json
{
  "model": "gpt-5",
  "input": [
    {"role": "user", "content": "What is the weather like in Paris today?"}
  ],
  "tools": [
    {
      "type": "function",
      "name": "get_weather",
      "description": "Get current temperature for a given location.",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City and country e.g. Bogotá, Colombia"
          }
        },
        "required": ["location"],
        "additionalProperties": false
      },
      "strict": true
    }
  ]
}
```

### Response
#### Success Response (200)
- **output_items** (array) - Description: Contains the model's response, which may include text output or a tool call object indicating the function the model wants to invoke.
  - **type** (string) - Description: The type of output item (e.g., "tool_calls", "text").
  - **tool_calls** (array) - Description: An array of tool call objects if the model decided to call a tool.
    - **id** (string) - Description: A unique identifier for the tool call.
    - **type** (string) - Description: The type of tool call, typically "function".
    - **function** (object) - Description: Details of the function call.
      - **name** (string) - Description: The name of the function to call.
      - **arguments** (string) - Description: A JSON string of the arguments for the function.

#### Response Example (Model calls the function)
```json
{
  "output_items": [
    {
      "type": "tool_calls",
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "get_weather",
            "arguments": "{\"location\": \"Paris, France\"}"
          }
        }
      ]
    }
  ]
}
```

#### Response Example (Model provides a text response)
```json
{
  "output_items": [
    {
      "type": "text",
      "text": "I can get the weather for Paris. Would you like me to do that?"
    }
  ]
}
```
```

--------------------------------

### Initialize OpenAI Client for Function Calling in Python

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=chat

This code snippet demonstrates the initial setup for using OpenAI's function calling feature in Python. It imports the necessary 'OpenAI' library and initializes the client, which is the first step in interacting with the OpenAI API for tool calls.

```python
from openai import OpenAI
import json

client = OpenAI()
```

--------------------------------

### Define and Use OpenAI Function Tool

Source: https://platform.openai.com/docs/quickstart

This example demonstrates how to configure the OpenAI API with a custom function tool, allowing the model to generate function calls based on user input. It defines a 'get_weather' function with specific parameters for location. The model will then suggest calling this function if the user's query is relevant, with the output containing the suggested function call.

```csharp
using System.Text.Json;
using OpenAI.Responses;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIResponseClient client = new(model: "gpt-5", apiKey: key);

ResponseCreationOptions options = new();
options.Tools.Add(ResponseTool.CreateFunctionTool(
        functionName: "get_weather",
        functionDescription: "Get current temperature for a given location.",
        functionParameters: BinaryData.FromObjectAsJson(new
        {
            type = "object",
            properties = new
            {
                location = new
                {
                    type = "string",
                    description = "City and country e.g. Bogotá, Colombia"
                }
            },
            required = new[] { "location" },
            additionalProperties = false
        }),
        strictModeEnabled: true
    )
);

OpenAIResponse response = (OpenAIResponse)client.CreateResponse([
    ResponseItem.CreateUserMessageItem([
        ResponseContentPart.CreateInputTextPart("What is the weather like in Paris today?")
    ])
], options);

Console.WriteLine(JsonSerializer.Serialize(response.OutputItems[0]));
```

```bash
curl -X POST https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5",
    "input": [
      {"role": "user", "content": "What is the weather like in Paris today?"}
    ],
    "tools": [
      {
        "type": "function",
        "name": "get_weather",
        "description": "Get current temperature for a given location.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City and country e.g. Bogotá, Colombia"
            }
          },
          "required": ["location"],
          "additionalProperties": false
        },
        "strict": true
      }
    ]
  }'
```

--------------------------------

### Accumulate Streaming Tool Call Arguments (Python/JavaScript)

Source: https://platform.openai.com/docs/guides/function-calling_api-mode=responses

Demonstrates how to process a stream of events from an OpenAI response to accumulate `function_call_arguments.delta` events into a complete function call. It updates a dictionary/object `final_tool_calls` with full `output_item.added` events and appends deltas to existing arguments for both Python and JavaScript.

```python
final_tool_calls[event.output_index] = event.item;
    elif event.type === 'response.function_call_arguments.delta':
        index = event.output_index

        if final_tool_calls[index]:
            final_tool_calls[index].arguments += event.delta
```

```javascript
const finalToolCalls = {};

for await (const event of stream) {
    if (event.type === 'response.output_item.added') {
        finalToolCalls[event.output_index] = event.item;
    } else if (event.type === 'response.function_call_arguments.delta') {
        const index = event.output_index;

        if (finalToolCalls[index]) {
            finalToolCalls[index].arguments += event.delta;
        }
    }
}
```

--------------------------------

### POST /v1/responses - Model with Function Calling Tool

Source: https://platform.openai.com/docs/quickstart_api-mode=responses

This endpoint allows the model to call custom functions defined by you. The model will determine if a function needs to be called based on the input and its defined parameters.

```APIDOC
## POST /v1/responses

### Description
This endpoint allows the model to call custom functions defined by you. The model will determine if a function needs to be called based on the input and its defined parameters.

### Method
POST

### Endpoint
/v1/responses

### Parameters
#### Path Parameters

#### Query Parameters

#### Request Body
- **model** (string) - Required - The ID of the model to use (e.g., "gpt-5").
- **input** (array of objects) - Required - A list of message objects for the conversation. Each object must have a `role` and `content`.
- **tools** (array of objects) - Required - A list of tool definitions. For function calling, `type` should be "function", with `name`, `description`, and `parameters` (JSON Schema).

### Request Example
```json
{
  "model": "gpt-5",
  "input": [
    {
      "role": "user",
      "content": "What is the weather like in Paris today?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "name": "get_weather",
      "description": "Get current temperature for a given location.",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City and country e.g. Bogotá, Colombia"
          }
        },
        "required": ["location"],
        "additionalProperties": false
      },
      "strict": true
    }
  ]
}
```

### Response
#### Success Response (200)
- **output** (array of objects) - The model's response, which might include tool calls. If a tool is called, it will contain `tool_calls` with `id`, `type`, and `function` details (name and arguments).

#### Response Example
```json
{
  "output": [
    {
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "get_weather",
            "arguments": "{\"location\": \"Paris, France\"}"
          }
        }
      ]
    }
  ]
}
```
```
