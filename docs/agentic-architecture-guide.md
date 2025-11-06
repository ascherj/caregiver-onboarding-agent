# Agentic Architecture Guide: Secret Agents Project Structure

## Overview

This document analyzes the Secret Agents project structure as a reference implementation for building robust, scalable agentic applications. The architecture demonstrates best practices for LLM-orchestrated systems that integrate tool usage, state management, and real-time user interaction.

## Core Philosophy

The Secret Agents project exemplifies **LLM-as-Orchestrator** architecture where the language model acts as a central controller that:
- Interprets user intent
- Decides when and how to use tools
- Maintains conversation context
- Coordinates between multiple subsystems

---

## Directory Structure

```
secret_agents/
├── src/
│   ├── app.py                      # Main application entry point
│   ├── conversation_manager.py     # CLI utility for conversation management
│   ├── requirements.txt            # Python dependencies
│   ├── mission_log.json           # Persistent conversation storage
│   ├── game_state.json            # Game state persistence
│   │
│   ├── llm/                       # LLM integration layer
│   │   └── llm_interface.py       # LLM communication & prompt engineering
│   │
│   ├── gadgets/                   # Tool implementations (extensible)
│   │   ├── weather.py             # External API integration example
│   │   └── decryptor.py           # Pure computation tool example
│   │
│   ├── utils/                     # Core business logic
│   │   ├── tool_executor.py       # Tool routing and execution
│   │   ├── mission_log.py         # Conversation persistence & lifecycle
│   │   └── game_state.py          # Game-specific state management
│   │
│   └── templates/                 # Frontend UI
│       └── index.html             # WebSocket-based chat interface
│
├── DEMO.md                        # Feature documentation
└── secret_agents.ipynb            # Learning material & specifications
```

---

## Architectural Layers

### 1. **Entry Point Layer** (`app.py`)

**Purpose**: Orchestrate communication between frontend, LLM, and tools.

**Key Responsibilities**:
- WebSocket server for real-time bidirectional communication
- Request routing and error handling
- Coordination of the LLM → Tool → Response pipeline

**Agentic Practices Demonstrated**:

```python
# Clean separation of concerns
from llm.llm_interface import send_to_llm, clean_tool_references
from utils.tool_executor import execute_tool
from utils.mission_log import (
    load_mission_log,
    save_mission_log,
    add_message_to_conversation,
    end_current_conversation
)
```

**Core Message Flow** (`@socketio.on("message")`):
```
User Input → LLM Decision → Tool Execution (if needed) →
LLM Final Response → Persist to Log → Return to User
```

**Key Design Decisions**:
- **WebSocket over REST**: Enables real-time updates and maintains persistent connection
- **Stateless request handling**: All state stored in JSON files, not in-memory
- **Error boundaries**: Try-catch blocks around each handler prevent cascade failures
- **Separation of data flows**: Conversation management endpoints separate from message handling

**Pattern**: The entry point never contains business logic—it's purely a coordinator.

---

### 2. **LLM Integration Layer** (`llm/llm_interface.py`)

**Purpose**: Abstract LLM communication and handle prompt engineering.

**Agentic Practices Demonstrated**:

#### Structured Tool Protocol
The LLM is trained to respond in a specific format for tool invocation:

```python
tools_description = """You are a helpful secret agent assistant. You have access to these tools:

TOOLS:
- weather: Get weather for a location
  Usage: {"tool": "weather", "parameters": {"city": "location_name"}}
- decrypt: Decrypt Caesar cipher
  Usage: {"tool": "decrypt", "parameters": {"ciphertext": "text", "shift": number}}

INSTRUCTIONS:
1. If you need to use tools, respond with: [{"action": "use_tools", "tools": [{"tool": "tool_name", "parameters": {...}}]}]
2. After tools are executed, you'll get results to incorporate in your final response
3. If no tools needed, respond normally
"""
```

**Why This Matters**:
- **Explicit contract**: LLM knows exactly what tools exist and how to invoke them
- **JSON-structured responses**: Parseable, predictable outputs
- **Two-phase interaction**: Tool decision → Tool execution → Final response generation

#### Response Cleaning
```python
def clean_tool_references(response):
    """Remove references to tools and tool usage from LLM responses."""
```

**Key Insight**: The user shouldn't know tools were used—responses should feel natural. This function strips meta-references like "based on the tool results" to maintain immersion.

**Pattern**: LLM interface handles prompt construction AND response post-processing.

---

### 3. **Tool Execution Layer** (`utils/tool_executor.py`)

**Purpose**: Route tool invocations to appropriate implementations.

**Structure**:
```python
def execute_tool(tool_name, parameters):
    if tool_name == "weather":
        city = parameters.get("city")
        if city:
            return get_weather(city)
        else:
            return "Error: City parameter required for weather tool."

    elif tool_name == "decrypt":
        ciphertext = parameters.get("ciphertext")
        shift = parameters.get("shift")
        if ciphertext and shift is not None:
            return decrypt_message(ciphertext, shift)
        else:
            return "Error: Both ciphertext and shift parameters required."

    else:
        return "Unknown tool requested."
```

**Agentic Practices Demonstrated**:
- **Validation at execution**: Check parameters before calling tools
- **Graceful degradation**: Return error messages, don't throw exceptions
- **Simple routing**: If-elif chain makes tool registration explicit and debuggable

**Extensibility Pattern**: To add a new tool:
1. Create implementation in `gadgets/`
2. Import in `tool_executor.py`
3. Add elif branch with parameter validation
4. Update LLM's tool description in `llm_interface.py`

**Alternative Approaches**:
- **Registry pattern**: Use a dictionary to map tool names to functions
- **Decorator-based**: Auto-register tools with `@register_tool` decorator
- **Plugin system**: Dynamically discover tools from a directory

The current approach prioritizes **simplicity and explicitness** over automation.

---

### 4. **Tool Implementations** (`gadgets/`)

**Purpose**: Contain isolated, testable tool logic.

#### Example: External API Integration (`weather.py`)

```python
def get_weather(location):
    API_KEY = "aeaf8baf977a603cf38a6d648085c74d"
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}&units=imperial"

    try:
        response = requests.get(url)
        data = response.json()
        if data["cod"] == 200:
            weather = data["weather"][0]["description"]
            temperature = data["main"]["temp"]
            return f"Weather in {location}: {weather}, {temperature}°F"
        else:
            return f"Could not retrieve weather for {location}."
    except Exception as e:
        return "Error retrieving weather data."
```

**Agentic Practices**:
- **Error handling**: Network failures don't crash the application
- **Formatted responses**: Returns natural language strings, not raw JSON
- **Clear function signature**: Simple input → output contract

#### Example: Pure Computation (`decryptor.py`)

```python
def decrypt_message(ciphertext, shift):
    decrypted = []
    for char in ciphertext:
        if char.isalpha():
            shift_char = chr(((ord(char) - 65 - shift) % 26) + 65)
            decrypted.append(shift_char)
        else:
            decrypted.append(char)
    return f"Unencrypted message: {''.join(decrypted)}"
```

**Key Insight**: Tools can be computations, API calls, database queries, or file operations. The abstraction is the same.

**Design Principle**: Each gadget is **self-contained** and could be tested independently without the LLM or Flask app.

---

### 5. **State Management Layer** (`utils/mission_log.py`)

**Purpose**: Manage conversation lifecycle and persistence.

**Key Data Structure**:

```json
{
  "conversations": [
    {
      "conversation_id": "abc123",
      "started_at": "2025-09-20T10:58:09.865084",
      "last_updated": "2025-09-20T11:04:22.431569",
      "status": "active",  // or "completed"
      "messages": [
        {
          "timestamp": "2025-09-20T10:58:09.865084",
          "user_message": "Weather in Denver",
          "agent_response": "Clear sky, 71°F",
          "llm_raw_response": "[{action: 'use_tools'...}]",
          "tool_calls": [
            {
              "tool": "weather",
              "parameters": {"city": "Denver"},
              "result": "Clear sky, 71°F"
            }
          ]
        }
      ]
    }
  ],
  "current_conversation_id": "abc123",
  "metadata": {
    "total_conversations": 1,
    "last_activity": "2025-09-20T11:04:22.431569"
  }
}
```

**Agentic Practices Demonstrated**:

#### 1. Conversation Lifecycle Management

```python
def get_current_conversation(mission_log):
    """Get or create the current active conversation."""
    current_id = mission_log.get("current_conversation_id")

    if current_id:
        for conv in mission_log["conversations"]:
            if conv["conversation_id"] == current_id and conv["status"] == "active":
                return conv

    # No active conversation found, create a new one
    return create_new_conversation(mission_log)
```

**Pattern**: Lazy initialization—conversations are created only when needed.

#### 2. Migration Support

```python
def migrate_old_format(old_data):
    """Migrate old format to new conversation structure."""
    new_log = create_empty_mission_log()

    if old_data.get("conversation"):
        # Create a single conversation from all old entries
        conversation_id = str(uuid.uuid4())[:8]
        conversation = {
            "conversation_id": conversation_id,
            "started_at": old_data["conversation"][0]["timestamp"],
            "last_updated": old_data["conversation"][-1]["timestamp"],
            "messages": old_data["conversation"],
            "status": "completed"
        }
        new_log["conversations"].append(conversation)

    return new_log
```

**Key Insight**: Production systems evolve. Build migration paths from day one.

#### 3. Rich Interaction Logging

```python
def add_message_to_conversation(mission_log, user_message, agent_response, llm_raw_response, tool_calls=None):
    """Add a new message to the current conversation."""
    conversation = get_current_conversation(mission_log)
    now = datetime.now().isoformat()

    message = {
        "timestamp": now,
        "user_message": user_message,
        "agent_response": agent_response,
        "llm_raw_response": llm_raw_response
    }

    if tool_calls:
        message["tool_calls"] = tool_calls

    conversation["messages"].append(message)
    conversation["last_updated"] = now
    mission_log["metadata"]["last_activity"] = now

    return mission_log
```

**Why This Matters**:
- **Debugging**: `llm_raw_response` lets you see what the LLM actually said
- **Analytics**: Track which tools are used most frequently
- **Reproducibility**: Replay entire conversations with full context
- **Training data**: Logs can be used to fine-tune models

**Design Principle**: Log everything. Storage is cheap; lost context is expensive.

---

### 6. **CLI Management Tool** (`conversation_manager.py`)

**Purpose**: Provide non-UI access to conversation data.

**Commands**:
- `list`: Show all conversations
- `show <id>`: Display full conversation history
- `end`: Mark current conversation as complete
- `new`: Start a new conversation
- `export <id> <file>`: Export conversation to JSON

**Agentic Practices Demonstrated**:

```python
def list_conversations():
    """List all conversations with their details."""
    mission_log = load_mission_log()
    conversations = mission_log.get("conversations", [])

    if not conversations:
        print("No conversations found.")
        return

    print(f"Total conversations: {len(conversations)}")
    print(f"Current conversation ID: {mission_log.get('current_conversation_id', 'None')}")

    for conv in conversations:
        msg_count = len(conv["messages"])
        first_msg = conv["messages"][0]["user_message"][:50] + "..."

        print(f"ID: {conv['conversation_id']}")
        print(f"  Status: {conv['status']}")
        print(f"  Messages: {msg_count}")
        print(f"  First Message: {first_msg}")
```

**Why CLI Tools Matter**:
- **Development**: Quickly inspect state without UI
- **Debugging**: Access full conversation details
- **Automation**: Script-based testing and data export
- **Operations**: Monitor and manage system state

**Pattern**: Business logic lives in `utils/`, CLI is just a thin wrapper.

---

## Key Agentic Patterns & Best Practices

### 1. **Separation of Concerns**

**Principle**: Each module has a single, well-defined responsibility.

| Layer | Responsibility | Doesn't Handle |
|-------|---------------|----------------|
| `app.py` | Routing, coordination | LLM prompts, tool logic, data structure |
| `llm_interface.py` | LLM communication | Tool execution, persistence |
| `tool_executor.py` | Tool routing | Tool implementation, LLM interaction |
| `gadgets/*` | Tool implementation | How they're invoked, state management |
| `mission_log.py` | Data persistence | UI, WebSocket, LLM |

**Benefit**: You can change the LLM provider, add new tools, or swap WebSocket for REST without touching unrelated code.

---

### 2. **Data-Driven Tool Registration**

The LLM learns about tools through **descriptions embedded in prompts**, not hardcoded logic:

```python
TOOLS:
- weather: Get weather for a location
  Usage: {"tool": "weather", "parameters": {"city": "location_name"}}
```

**Implication**: To add a tool, you update:
1. The description (LLM learns about it)
2. The executor (routes to implementation)
3. The implementation (in `gadgets/`)

**Benefit**: Clear checklist for tool addition; no hidden dependencies.

---

### 3. **Two-Phase LLM Interaction**

**Phase 1**: "What tools do I need?"
```
User: "What's the weather in Tokyo?"
LLM: [{"action": "use_tools", "tools": [{"tool": "weather", "parameters": {"city": "Tokyo"}}]}]
```

**Phase 2**: "Respond naturally with tool results"
```
Context: Tool results: weather: Weather in Tokyo: clear sky, 72°F
LLM: "It's currently a clear day in Tokyo with a comfortable temperature of 72°F."
```

**Why Split This?**:
- **Deterministic execution**: Tools run in Python, not LLM hallucinations
- **Reliability**: API calls don't fail inside the LLM context
- **Observability**: You see exactly what tools ran and their outputs
- **Cost efficiency**: Only make one LLM call after getting all tool results

**Alternative Approach**: ReAct pattern (reasoning and action interwoven) requires multiple LLM calls per tool.

---

### 4. **Conversation-Based State Management**

Instead of in-memory session variables:
- Each conversation has a unique ID
- All state persisted to JSON
- Metadata tracks lifecycle (active/completed)

**Benefits**:
- **Stateless server**: Can restart without losing data
- **Multi-session support**: Multiple users or conversation branches
- **Auditing**: Full history of every interaction
- **Debugging**: Replay conversations to reproduce bugs

**Implementation Detail**: The `current_conversation_id` acts as a pointer to the active session.

---

### 5. **Graceful Error Handling**

Every function that can fail returns an error **string**, not an exception:

```python
try:
    response = requests.get(url)
    data = response.json()
    if data["cod"] == 200:
        return f"Weather in {location}: {weather}, {temperature}°F"
    else:
        return f"Could not retrieve weather for {location}."
except Exception as e:
    return "Error retrieving weather data."
```

**Why?**:
- The LLM can incorporate error messages into natural responses
- The conversation continues even if a tool fails
- Users see helpful messages, not stack traces

**Pattern**: Errors are **values**, not exceptions (functional programming principle).

---

### 6. **Extensibility Through Convention**

To add a new tool:

```python
# 1. Create gadgets/translator.py
def translate_text(text, target_language):
    # Implementation
    return translated_text

# 2. Update utils/tool_executor.py
elif tool_name == "translate":
    text = parameters.get("text")
    target = parameters.get("target_language")
    if text and target:
        return translate_text(text, target)
    else:
        return "Error: text and target_language required."

# 3. Update llm/llm_interface.py
TOOLS:
- translate: Translate text to another language
  Usage: {"tool": "translate", "parameters": {"text": "...", "target_language": "..."}}
```

**Key Insight**: The structure guides you to the right places. No hidden registration steps.

---

### 7. **Testability by Design**

Each layer can be tested independently:

```python
# Test a gadget in isolation
def test_decryptor():
    result = decrypt_message("IFMMP", 1)
    assert "HELLO" in result

# Test tool executor
def test_tool_routing():
    result = execute_tool("decrypt", {"ciphertext": "IFMMP", "shift": 1})
    assert "HELLO" in result

# Test mission log
def test_conversation_creation():
    log = create_empty_mission_log()
    log = add_message_to_conversation(log, "Hi", "Hello", "{}")
    assert len(log["conversations"]) == 1
```

**Benefit**: Fast, focused tests without spinning up Flask or mocking LLM calls.

---

### 8. **Logging for Observability**

The mission log captures:
- **User intent** (`user_message`)
- **LLM decision** (`llm_raw_response`)
- **Tool execution** (`tool_calls` with parameters and results)
- **Final response** (`agent_response`)

**Use Cases**:
- **Debugging**: Why did the LLM choose this tool?
- **Analytics**: Which tools are most used?
- **Fine-tuning**: Export logs as training data
- **Compliance**: Audit trail of all actions

---

### 9. **WebSocket for Real-Time Interaction**

**Why WebSocket over REST**:
- **Bidirectional**: Server can push updates to client
- **Stateful connection**: No repeated handshakes
- **Low latency**: Instant message delivery

**Event-Driven Design**:
```python
@socketio.on("message")
def handle_message(message):
    # Process and respond

@socketio.on("end_conversation")
def handle_end_conversation():
    # Update state

@socketio.on("get_conversations")
def handle_get_conversations():
    # Return history
```

**Pattern**: Each event handler is focused on a single action.

---

### 10. **Migration-First Data Design**

The `migrate_old_format()` function demonstrates forward-thinking:
- Detects old schema
- Converts to new structure
- Preserves existing data

**Why This Matters**:
- **Production evolution**: Schema changes don't break deployments
- **User experience**: No data loss during updates
- **Development velocity**: Can iterate on data structure

**Pattern**: Always include `version` field in data structures for future migrations.

---

## Applying This Architecture to New Projects

### Starting Template Structure

```
your_agent/
├── src/
│   ├── app.py                    # Main entry point
│   ├── requirements.txt          # Dependencies
│   ├── conversation_log.json     # Conversation persistence
│   │
│   ├── llm/                      # LLM integration
│   │   └── llm_interface.py
│   │
│   ├── tools/                    # Tool implementations
│   │   ├── tool_one.py
│   │   └── tool_two.py
│   │
│   ├── utils/                    # Business logic
│   │   ├── tool_executor.py
│   │   ├── conversation_log.py
│   │   └── state_manager.py     # Domain-specific state
│   │
│   └── templates/                # UI
│       └── index.html
│
└── README.md
```

### Implementation Checklist

#### Phase 1: Foundation
- [ ] Set up Flask with SocketIO
- [ ] Create basic `llm_interface.py` with your LLM provider
- [ ] Implement `conversation_log.py` for state persistence
- [ ] Build simple UI with WebSocket connection
- [ ] Test end-to-end message flow (no tools yet)

#### Phase 2: Tool Infrastructure
- [ ] Create `tool_executor.py` with routing logic
- [ ] Implement first tool in `tools/`
- [ ] Update LLM prompt with tool description
- [ ] Test tool invocation flow
- [ ] Add error handling for tool failures

#### Phase 3: Conversation Management
- [ ] Implement conversation lifecycle (create/end/list)
- [ ] Add conversation metadata tracking
- [ ] Build CLI tool for inspection
- [ ] Test conversation persistence across restarts

#### Phase 4: Polish & Production
- [ ] Add response cleaning (strip meta-references)
- [ ] Implement migration system for schema changes
- [ ] Add comprehensive error handling
- [ ] Create monitoring/logging
- [ ] Write tests for each layer

### Customization Points

1. **LLM Provider**: Swap Ollama for OpenAI, Anthropic, etc. in `llm_interface.py`
2. **Tool Protocol**: Use function calling APIs instead of JSON responses
3. **Persistence**: Replace JSON files with database (SQLite, PostgreSQL)
4. **UI**: Add React frontend, mobile app, or CLI-only interface
5. **State Management**: Add domain-specific state beyond conversations

---

## Advanced Patterns for Scaling

### 1. **Multi-Agent Systems**

Extend the architecture to support multiple agents:

```python
# utils/agent_coordinator.py
def route_to_agent(message, context):
    """Determine which agent should handle this message."""
    if is_weather_query(message):
        return "weather_agent"
    elif is_code_query(message):
        return "code_agent"
    else:
        return "general_agent"

# Each agent has its own tools and prompts
agents = {
    "weather_agent": WeatherAgent(),
    "code_agent": CodeAgent(),
    "general_agent": GeneralAgent()
}
```

### 2. **Tool Chaining**

Allow the LLM to plan multi-step tool sequences:

```json
{
  "action": "use_tools",
  "plan": "First get weather, then suggest outfit",
  "tools": [
    {"tool": "weather", "parameters": {"city": "Tokyo"}},
    {"tool": "outfit_suggester", "parameters": {"weather": "$PREVIOUS_RESULT"}}
  ]
}
```

### 3. **Streaming Responses**

For long-running tasks, stream partial results:

```python
@socketio.on("message")
def handle_message_stream(message):
    emit("response_start", {})

    for chunk in llm_stream(message):
        emit("response_chunk", {"chunk": chunk})

    emit("response_complete", {})
```

### 4. **Memory & Context Windows**

Implement sliding window for long conversations:

```python
def get_conversation_context(conversation, max_messages=10):
    """Get recent messages + summary of earlier messages."""
    recent = conversation["messages"][-max_messages:]

    if len(conversation["messages"]) > max_messages:
        summary = summarize_messages(conversation["messages"][:-max_messages])
        return [summary] + recent

    return recent
```

### 5. **Tool Result Caching**

Cache expensive tool calls:

```python
import hashlib
import json

TOOL_CACHE = {}

def execute_tool_cached(tool_name, parameters):
    cache_key = hashlib.md5(
        f"{tool_name}:{json.dumps(parameters, sort_keys=True)}".encode()
    ).hexdigest()

    if cache_key in TOOL_CACHE:
        return TOOL_CACHE[cache_key]

    result = execute_tool(tool_name, parameters)
    TOOL_CACHE[cache_key] = result
    return result
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Tool Hallucination
**Problem**: LLM invokes tools that don't exist or with wrong parameters.

**Solution**:
- Provide clear, explicit tool schemas in prompts
- Validate tool names before execution
- Return helpful error messages to LLM when tools fail
- Consider using function calling APIs (OpenAI, Claude) for structured outputs

### Pitfall 2: Conversation Context Loss
**Problem**: LLM forgets earlier conversation context.

**Solution**:
- Include conversation history in prompts (with windowing)
- Persist conversation state to storage
- Use conversation summaries for very long interactions

### Pitfall 3: Error Propagation
**Problem**: Tool failures crash the entire conversation.

**Solution**:
- Catch all exceptions at tool execution layer
- Return error messages as strings, not exceptions
- Let LLM incorporate errors into natural responses

### Pitfall 4: Prompt Injection
**Problem**: User input manipulates LLM behavior.

**Solution**:
- Sanitize user input before adding to prompts
- Use system/user message separation (if LLM supports)
- Validate tool parameters before execution
- Implement guardrails for sensitive operations

### Pitfall 5: State Synchronization
**Problem**: In-memory state diverges from persistent storage.

**Solution**:
- Load state at start of every request
- Save state after every modification
- Avoid caching state in memory
- Use database transactions if moving beyond JSON files

---

## Testing Strategy

### Unit Tests
```python
# Test individual tools
def test_weather_tool():
    result = get_weather("London")
    assert "Weather in London" in result

# Test tool executor routing
def test_tool_executor():
    result = execute_tool("weather", {"city": "Tokyo"})
    assert result != "Unknown tool requested."
```

### Integration Tests
```python
# Test LLM → Tool → Response flow
def test_llm_tool_integration():
    response = send_to_llm("What's the weather in Paris?")
    data = json.loads(response)[0]
    assert data["action"] == "use_tools"
    assert data["tools"][0]["tool"] == "weather"
```

### End-to-End Tests
```python
# Test full conversation flow
def test_full_conversation():
    client = socketio.test_client(app)
    client.emit("message", "Weather in Tokyo?")
    received = client.get_received()
    assert "response" in received[0]["name"]
```

---

## Performance Considerations

### 1. **LLM Latency**
- Use streaming for long responses
- Cache common queries
- Consider using smaller, faster models for tool selection

### 2. **Tool Execution**
- Run slow tools asynchronously
- Implement timeouts
- Cache expensive API calls

### 3. **State Management**
- Use database for high-concurrency scenarios
- Implement connection pooling
- Add indexes for conversation lookups

### 4. **Frontend Optimization**
- Lazy-load conversation history
- Implement pagination for long conversations
- Use WebSocket reconnection logic

---

## Security Considerations

### 1. **Input Validation**
```python
def sanitize_user_input(message):
    # Remove potentially harmful characters
    # Limit message length
    # Check for prompt injection patterns
    return cleaned_message
```

### 2. **Tool Authorization**
```python
TOOL_PERMISSIONS = {
    "weather": ["all"],
    "execute_code": ["admin"],
    "delete_database": ["superadmin"]
}

def can_use_tool(user_role, tool_name):
    return user_role in TOOL_PERMISSIONS.get(tool_name, [])
```

### 3. **API Key Management**
- Store keys in environment variables, not code
- Rotate keys regularly
- Use API key management services for production

### 4. **Rate Limiting**
```python
from flask_limiter import Limiter

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@socketio.on("message")
@limiter.limit("10 per minute")
def handle_message(message):
    # ...
```

---

## Migration to Production

### From JSON to Database

```python
# utils/conversation_store.py
import sqlite3

class ConversationStore:
    def __init__(self, db_path="conversations.db"):
        self.conn = sqlite3.connect(db_path)
        self._create_tables()

    def _create_tables(self):
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                started_at TEXT,
                last_updated TEXT,
                status TEXT
            )
        """)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id TEXT,
                timestamp TEXT,
                user_message TEXT,
                agent_response TEXT,
                llm_raw_response TEXT,
                FOREIGN KEY (conversation_id) REFERENCES conversations(id)
            )
        """)

    def get_conversation(self, conversation_id):
        # Query database
        pass

    def save_message(self, conversation_id, message_data):
        # Insert into database
        pass
```

### Deployment Checklist
- [ ] Move from SQLite to PostgreSQL
- [ ] Add authentication and user management
- [ ] Implement rate limiting
- [ ] Set up monitoring (error tracking, performance metrics)
- [ ] Configure environment-based settings (dev/staging/prod)
- [ ] Add health check endpoints
- [ ] Set up CI/CD pipeline
- [ ] Configure HTTPS/SSL
- [ ] Implement backup strategy for database

---

## Conclusion

The Secret Agents architecture demonstrates **production-ready patterns for agentic systems**:

1. **Clear separation of concerns** makes code maintainable
2. **Data-driven tool registration** enables extensibility
3. **Two-phase LLM interaction** provides reliability
4. **Conversation-based state** enables statefulness
5. **Graceful error handling** creates robust systems
6. **Comprehensive logging** enables debugging and analytics

**Use this structure as a foundation** for your next agentic project. Start simple, test thoroughly, and scale incrementally.

---

## Additional Resources

- **LLM Function Calling**: OpenAI, Anthropic, Ollama documentation
- **WebSocket Patterns**: Flask-SocketIO best practices
- **State Management**: Event sourcing, CQRS patterns
- **Agent Frameworks**: LangChain, AutoGPT, BabyAGI for inspiration
- **Testing**: pytest for Python, Postman for API testing

---

**Happy building! 🚀**
