### POST /v1/audio/transcriptions (Whisper API - Prompt Parameter)

Source: https://platform.openai.com/docs/guides/speech-to-text_lang=curl

This endpoint transcribes audio files using the Whisper API. It leverages the optional 'prompt' parameter to provide a dictionary of correct spellings for uncommon words or acronyms, significantly improving transcription accuracy for specific vocabulary.

```APIDOC
## POST /v1/audio/transcriptions

### Description
Transcribes audio files using the Whisper API, improving reliability for uncommon words or acronyms by providing a prompt parameter with correct spellings.

### Method
POST

### Endpoint
/v1/audio/transcriptions

### Parameters
#### Path Parameters
_None_

#### Query Parameters
_None_

#### Request Body
This endpoint accepts `multipart/form-data`.
- **file** (file) - Required - The audio file to transcribe (e.g., MP3, WAV).
- **model** (string) - Required - The model to use for transcription (e.g., `whisper-1`).
- **response_format** (string) - Optional - The format of the transcription response. Defaults to `json`. Example: `text`, `json`, `srt`, `vtt`, `verbose_json`.
- **prompt** (string) - Optional - A string containing correct spellings of uncommon words or acronyms to guide the transcription model. Limited to the first 224 tokens.

### Request Example
```json
{
  "model": "whisper-1",
  "file": "@/path/to/file/speech.mp3",
  "response_format": "text",
  "prompt": "ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array"
}
```

### Response
#### Success Response (200)
- **text** (string) - The transcribed text.

#### Response Example
```json
{
  "text": "Hello, this is a test with ZyntriQix and Digique Plus."
}
```
```

--------------------------------

### Enhance Whisper Transcriptions with Prompt Parameter

Source: https://platform.openai.com/docs/guides/speech-to-text_lang=curl

This method leverages the Whisper API's optional 'prompt' parameter to provide the model with a dictionary of correct spellings for uncommon words or acronyms. The model uses this information to improve transcription accuracy for the specified terms, though it's limited to the first 224 tokens of the prompt.

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("/path/to/file/speech.mp3"),
  model: "whisper-1",
  response_format: "text",
  prompt:"ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T."
});

console.log(transcription.text);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("/path/to/file/speech.mp3", "rb")

transcription = client.audio.transcriptions.create(
  model="whisper-1",
  file=audio_file,
  response_format="text",
  prompt="ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T."
)

print(transcription.text)
```

```curl
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/speech.mp3 \
  --form model=whisper-1 \
  --form prompt="ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T."
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/realtime-beta-client-events/conversation/item/truncate

Translates an audio file into English text using the Whisper model.

```APIDOC
## POST /v1/audio/translations

### Description
Translates audio into English text.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object to translate. Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string) - Required - ID of the model to use. Currently, only `whisper-1` is available.
- **prompt** (string) - Optional - An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

### Request Example
```curl
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

### Response
#### Success Response (200)
- **text** (string) - The translated text.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### Correct Whisper Transcriptions using GPT-4 Post-Processing

Source: https://platform.openai.com/docs/guides/speech-to-text_lang=curl

This technique improves Whisper's transcription reliability by employing a post-processing step with GPT-4 (or GPT-3.5-Turbo). It involves defining a detailed system prompt for the large language model to correct spelling discrepancies in the initial transcription, particularly for product or company names. This method offers a larger context window and superior instruction-following capabilities compared to Whisper's direct prompt parameter.

```javascript
const systemPrompt = `
YouYou are a helpful assistant for the company ZyntriQix. Your task is
to correct any spelling discrepancies in the transcribed text. Make
sure that the names of the following products are spelled correctly:
ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array,
OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K.,
Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as
periods, commas, and capitalization, and use only the context provided.
`;

const transcript = await transcribe(audioFile);
const completion = await openai.chat.completions.create({
model: "gpt-4.1",
temperature: temperature,
messages: [
  {
    role: "system",
    content: systemPrompt
  },
  {
    role: "user",
    content: transcript
  }
],
store: true,
});

console.log(completion.choices[0].message.content);
```

```python
system_prompt = """
You are a helpful assistant for the company ZyntriQix. Your task is to correct
any spelling discrepancies in the transcribed text. Make sure that the names of
the following products are spelled correctly: ZyntriQix, Digique Plus,
CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal
Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary
punctuation such as periods, commas, and capitalization, and use only the
context provided.
"""

def generate_corrected_transcript(temperature, system_prompt, audio_file):
  response = client.chat.completions.create(
      model="gpt-4.1",
      temperature=temperature,
      messages=[
          {
              "role": "system",
              "content": system_prompt
          },
          {
              "role": "user",
              "content": transcribe(audio_file, "")
          }
      ]
  )
  return completion.choices[0].message.content
corrected_text = generate_corrected_transcript(
  0, system_prompt, fake_company_filepath
)
```

--------------------------------

### Transcribing Audio with OpenAI Whisper using Prompt Parameter

Source: https://platform.openai.com/docs/guides/speech-to-text

This snippet demonstrates how to use the `prompt` parameter in the OpenAI Whisper API to guide the model on correct spellings of uncommon words or acronyms during audio transcription. It helps improve accuracy for specific terminology, though the prompt is limited to 224 tokens.

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("/path/to/file/speech.mp3"),
  model: "whisper-1",
  response_format: "text",
  prompt:"ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.",
});

console.log(transcription.text);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("/path/to/file/speech.mp3", "rb")

transcription = client.audio.transcriptions.create(
  model="whisper-1",
  file=audio_file,
  response_format="text",
  prompt="ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T."
)

print(transcription.text)
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/speech.mp3 \
  --form model=whisper-1 \
  --form prompt="ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T."
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/messages/listMessages

Translates an audio file into English using the Whisper model. It returns the translated text.

```APIDOC
## POST /v1/audio/translations

### Description
Translates audio into English.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string or "whisper-1") - Required - ID of the model to use. Only `whisper-1` (powered by our open source Whisper V2 model) is currently available.
- **prompt** (string) - Optional - An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.

### Request Example
```bash
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

### Response
#### Success Response (200)
- **text** (string) - The translated text.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### Correcting Whisper Transcriptions with GPT-4 Post-processing

Source: https://platform.openai.com/docs/guides/speech-to-text

This snippet demonstrates how to post-process transcribed text from the Whisper model using GPT-4 to correct spelling discrepancies, especially for product names or acronyms. It involves crafting a system prompt for GPT-4 to define correction rules and then passing the Whisper transcription as user content. This method is more scalable for longer lists of specific terms due to GPT-4's larger context window.

```javascript
const systemPrompt = `\nYou are a helpful assistant for the company ZyntriQix. Your task is \nto correct any spelling discrepancies in the transcribed text. Make \nsure that the names of the following products are spelled correctly: \nZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, \nOrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., \nQ.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as \nperiods, commas, and capitalization, and use only the context provided.\n`;

const transcript = await transcribe(audioFile);
const completion = await openai.chat.completions.create({
model: "gpt-4.1",
temperature: temperature,
messages: [
  {
    role: "system",
    content: systemPrompt
  },
  {
    role: "user",
    content: transcript
  }
],
store: true,
});

console.log(completion.choices[0].message.content);
```

```python
system_prompt = """\nYou are a helpful assistant for the company ZyntriQix. Your task is to correct \nany spelling discrepancies in the transcribed text. Make sure that the names of \nthe following products are spelled correctly: ZyntriQix, Digique Plus, \nCynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal \nMatrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary \npunctuation such as periods, commas, and capitalization, and use only the \ncontext provided.\n"""

def generate_corrected_transcript(temperature, system_prompt, audio_file):
  response = client.chat.completions.create(
      model="gpt-4.1",
      temperature=temperature,
      messages=[
          {
              "role": "system",
              "content": system_prompt
          },
          {
              "role": "user",
              "content": transcribe(audio_file, "")
          }
      ]
  )
  return completion.choices[0].message.content
corrected_text = generate_corrected_transcript(
  0, system_prompt, fake_company_filepath
)
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/audio/json-object

This endpoint translates audio from any supported language into English text. It leverages the Whisper V2 model for high-quality translations.

```APIDOC
## POST /v1/audio/translations

### Description
Translates audio from any spoken language into English.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string or "whisper-1") - Required - ID of the model to use. Only `whisper-1` (which is powered by our open source Whisper V2 model) is currently available.
- **prompt** (string) - Optional - An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.

### Request Example
```json
{
  "file": "@/path/to/file/german.m4a",
  "model": "whisper-1"
}
```

### Response
#### Success Response (200)
- **text** (string) - The translated text.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/conversations/create

Translates an audio file from any language into English. This endpoint utilizes the Whisper model to provide accurate translations.

```APIDOC
## POST /v1/audio/translations

### Description
Translates audio from any supported language into English.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate, in one of these formats: FLAC, MP3, MP4, MPEG, MPGA, M4A, OGG, WAV, or WEBM.
- **model** (string) - Required - ID of the model to use. Currently, only `whisper-1` is available.
- **prompt** (string) - Optional - An optional text in English to guide the model's style or continue a previous audio segment.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.

### Request Example
```json
{
  "file": "@/path/to/file/german.m4a",
  "model": "whisper-1"
}
```

### Response
#### Success Response (200)
- **text** (string) - The translated text in English.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/project-rate-limits/object

Translates audio into English using specified models like `whisper-1`.

```APIDOC
## POST /v1/audio/translations

### Description
This endpoint translates audio files from any supported language into English.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string) - Required - ID of the model to use. Currently, only `whisper-1` is available.
- **prompt** (string) - Optional - An optional text (in English) to guide the model's style or continue a previous audio segment.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values (e.g., 0.8) make output more random, lower values (e.g., 0.2) make it more focused.

### Request Example
```bash
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

### Response
#### Success Response (200)
- **text** (string) - The translated text in English.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### Translate Audio to English with `whisper-1`

Source: https://platform.openai.com/docs/guides/speech-to-text_lang=curl

This code illustrates how to translate an audio file from any supported language into English using OpenAI's `whisper-1` model. It reads an audio file (e.g., German) and sends it to the translation endpoint, printing the resulting English text. Note that only translation to English is supported.

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const translation = await openai.audio.translations.create({
  file: fs.createReadStream("/path/to/file/german.mp3"),
  model: "whisper-1",
});

console.log(translation.text);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("/path/to/file/german.mp3", "rb")

translation = client.audio.translations.create(
    model="whisper-1",
    file=audio_file,
)

print(translation.text)
```

```curl
curl --request POST \
  --url https://api.openai.com/v1/audio/translations \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/german.mp3 \
  --form model=whisper-1
```

--------------------------------

### Translate Audio to English with OpenAI Whisper-1 Model

Source: https://platform.openai.com/docs/api-reference/computer-use

This snippet demonstrates how to send an audio file to the OpenAI API for translation into English using the `whisper-1` model. It includes examples for `curl` (command line), Python, Node.js, and C#. The API returns the translated text.

```curl
curl https://api.openai.com/v1/audio/translations \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F file="@/path/to/file/german.m4a" \\
  -F model="whisper-1"
```

```python
from openai import OpenAI
client = OpenAI()

audio_file = open("speech.mp3", "rb")
transcript = client.audio.translations.create(
  model="whisper-1",
  file=audio_file
)
```

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
    const translation = await openai.audio.translations.create({
        file: fs.createReadStream("speech.mp3"),
        model: "whisper-1"
    });

    console.log(translation.text);
}
main();
```

```csharp
using System;

using OpenAI.Audio;

string audioFilePath = "audio.mp3";

AudioClient client = new(
    model: "whisper-1",
    apiKey: Environment.GetEnvironmentVariable("OPENAI_API_KEY")
);

AudioTranscription transcription = client.TranscribeAudio(audioFilePath);

Console.WriteLine($"{transcription.Text}");
```

--------------------------------

### Transcribe audio using OpenAI API (whisper-1) in C#

Source: https://platform.openai.com/docs/api-reference/audio/verbose-json-object

This C# example demonstrates how to transcribe an audio file using the OpenAI API's 'whisper-1' model. Although 'whisper-1' is often associated with translation, this specific code snippet performs a transcription operation.

```csharp
using System;

using OpenAI.Audio;

string audioFilePath = "audio.mp3";

AudioClient client = new(
    model: "whisper-1",
    apiKey: Environment.GetEnvironmentVariable("OPENAI_API_KEY")
);

AudioTranscription transcription = client.TranscribeAudio(audioFilePath);

Console.WriteLine($"{transcription.Text}");
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/assistants-streaming/run-step-delta-object

This endpoint translates audio files into English text using the `whisper-1` model.

```APIDOC
## POST /v1/audio/translations

### Description
This endpoint translates audio files into English text using the `whisper-1` model.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string) - Required - ID of the model to use. Only `whisper-1` is currently available.
- **prompt** (string) - Optional - An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.

### Request Example
```bash
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

### Response
#### Success Response (200)
- **text** (string) - The translated text.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/guides/speech-to-text

This endpoint translates audio from any supported language into English text using the `whisper-1` model.

```APIDOC
## POST /v1/audio/translations

### Description
Translates an audio file from any supported language into English text. This endpoint uses the `whisper-1` model.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body (multipart/form-data)
- **file** (file) - Required - The audio file to translate.
- **model** (string) - Required - The model to use for translation. Must be `whisper-1`.

### Request Example
```json
{
  "file": "@german.mp3",
  "model": "whisper-1"
}
```

### Response
#### Success Response (200)
- **text** (string) - The translated audio content in English.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### POST /v1/audio/transcriptions

Source: https://platform.openai.com/docs/guides/speech-to-text_lang=curl

Transcribes audio into text, supporting various languages and optional timestamp granularity for word or segment level detail. Supports `whisper-1` model.

```APIDOC
## POST /v1/audio/transcriptions

### Description
This endpoint transcribes an audio file into text. It supports a wide range of languages and can provide detailed timestamp information at the word or segment level, which is particularly useful for precise transcriptions and video editing.

### Method
POST

### Endpoint
`/v1/audio/transcriptions`

### Parameters
#### Query Parameters
*No query parameters.*

#### Request Body
This API uses `multipart/form-data` for file uploads and other parameters.
- **file** (file) - Required - The audio file to transcribe. Must be less than 25 MB. For larger files, consider splitting them into smaller chunks.
- **model** (string) - Required - ID of the model to use for transcription, e.g., `whisper-1`.
- **response_format** (string) - Optional - The format of the transcript output. Defaults to `json`. Other options include `text`, `srt`, `verbose_json`, `vtt`. When `verbose_json` is used with `timestamp_granularities`, detailed word/segment objects are returned.
- **timestamp_granularities[]** (array of strings) - Optional - Array of timestamp granularities to provide. Can be `word` or `segment`, or both. Only supported for the `whisper-1` model. Using `["word"]` with `response_format="verbose_json"` will return word-level timestamps.

### Request Example
```
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=word" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```

### Response
#### Success Response (200)
A successful response for `response_format="verbose_json"` with `timestamp_granularities=["word"]` includes the full transcribed text and an array of word objects with their start and end times.
- **text** (string) - The full transcribed text.
- **language** (string) - The language of the input audio.
- **duration** (number) - The duration of the audio in seconds.
- **words** (array of objects) - An array of word objects, each containing:
  - **word** (string) - The transcribed word.
  - **start** (number) - The start time of the word in seconds.
  - **end** (number) - The end time of the word in seconds.
- **segments** (array of objects) - An array of segment objects, each containing:
  - **id** (integer) - Unique identifier for the segment.
  - **seek** (integer) - Seek offset in the audio.
  - **start** (number) - Start time of the segment in seconds.
  - **end** (number) - End time of the segment in seconds.
  - **text** (string) - The text content of the segment.
  - **tokens** (array of integers) - Token IDs for the segment text.
  - **temperature** (number) - Model's confidence temperature for the segment.
  - **avg_logprob** (number) - Average log probability of the segment.
  - **compression_ratio** (number) - Compression ratio of the segment.
  - **no_speech_prob** (number) - Probability of no speech in the segment.

#### Response Example
```json
{
  "text": "Hello, this is a test transcription.",
  "language": "english",
  "duration": 3.5,
  "words": [
    {
      "word": "Hello,",
      "start": 0.1,
      "end": 0.5
    },
    {
      "word": "this",
      "start": 0.6,
      "end": 0.9
    },
    {
      "word": "is",
      "start": 1.0,
      "end": 1.1
    },
    {
      "word": "a",
      "start": 1.2,
      "end": 1.3
    },
    {
      "word": "test",
      "start": 1.4,
      "end": 1.7
    },
    {
      "word": "transcription.",
      "start": 1.8,
      "end": 2.8
    }
  ],
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.1,
      "end": 2.8,
      "text": " Hello, this is a test transcription.",
      "tokens": [50364, 2420, 11, 341, 307, 257, 1332, 18706, 13, 50644],
      "temperature": 0.0,
      "avg_logprob": -0.25,
      "compression_ratio": 1.2,
      "no_speech_prob": 0.01
    }
  ]
}
```
```

--------------------------------

### Perform OpenAI Audio Translation with `whisper-1`

Source: https://platform.openai.com/docs/api-reference/admin-api-keys/create

This snippet illustrates how to translate an audio file into English using the OpenAI API. It leverages the `whisper-1` model to convert spoken language from any supported language into English text. Examples are provided for cURL, Python, Node.js, and C#, requiring an audio file and your configured OpenAI API key.

```curl
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

```python
from openai import OpenAI
client = OpenAI()

audio_file = open("speech.mp3", "rb")
transcript = client.audio.translations.create(
  model="whisper-1",
  file=audio_file
)
```

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
    const translation = await openai.audio.translations.create({
        file: fs.createReadStream("speech.mp3"),
        model: "whisper-1",
    });

    console.log(translation.text);
}
main();
```

```csharp
using System;

using OpenAI.Audio;

string audioFilePath = "audio.mp3";

AudioClient client = new(
    model: "whisper-1",
    apiKey: Environment.GetEnvironmentVariable("OPENAI_API_KEY")
);

AudioTranscription transcription = client.TranscribeAudio(audioFilePath);

Console.WriteLine($"{transcription.Text}");
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/certificates/object

This endpoint translates an audio file into English. It requires an audio file and specifies the model to use, with 'whisper-1' currently being the only available option. Optional parameters allow for guiding the translation style and setting the output format.

```APIDOC
## POST /v1/audio/translations

### Description
Translates audio into English.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string) - Required - ID of the model to use. Only `whisper-1` is currently available.
- **prompt** (string) - Optional - An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.

### Request Example
```curl
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

### Response
#### Success Response (200)
- **text** (string) - The translated text.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/realtime-beta-client-events

This endpoint translates audio into English using the specified model, such as `whisper-1`. It supports various audio file formats and allows for optional parameters to guide the translation process.

```APIDOC
## POST /v1/audio/translations

### Description
This endpoint translates audio into English using the specified model, such as `whisper-1`. It supports various audio file formats and allows for optional parameters to guide the translation process.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate. Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string) - Required - ID of the model to use. Only `whisper-1` is currently available.
- **prompt** (string) - Optional - An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.

### Request Example
{
  "file": "@/path/to/file/german.m4a",
  "model": "whisper-1"
}

### Response
#### Success Response (200)
- **text** (string) - The translated text.

#### Response Example
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/realtime-beta-server-events/conversation/item/deleted

This endpoint translates an audio file into English text using the specified model, such as `whisper-1`. It returns the translated text.

```APIDOC
## POST /v1/audio/translations

### Description
This endpoint translates an audio file into English text using the specified model, such as `whisper-1`. It returns the translated text.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Request Body
- **file** (file) - Required - The audio file object to translate, in one of these formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string or "whisper-1") - Required - ID of the model to use. Currently, only `whisper-1` is available.
- **prompt** (string) - Optional - An optional text (in English) to guide the model's style or continue a previous audio segment.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values make output more random, lower values more deterministic.

### Request Example
```bash
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

### Response
#### Success Response (200)
- **text** (string) - The translated text.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### POST /v1/audio/translations

Source: https://platform.openai.com/docs/api-reference/realtime-server-events/response/done

Translates an audio file from any language into English using an OpenAI model, specifically `whisper-1`.

```APIDOC
## POST /v1/audio/translations

### Description
Translates an audio file from its original language into English using the specified model. Currently, only `whisper-1` is available for this operation.

### Method
POST

### Endpoint
/v1/audio/translations

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
- **file** (file) - Required - The audio file object (not file name) to translate. Supported formats include: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.
- **model** (string) - Required - ID of the model to use. Currently, only `whisper-1` is available.
- **prompt** (string) - Optional - An optional text to guide the model's style or continue a previous audio segment. The prompt should be in English.
- **response_format** (string) - Optional - Defaults to `json`. The format of the output. Options: `json`, `text`, `srt`, `verbose_json`, or `vtt`.
- **temperature** (number) - Optional - Defaults to `0`. The sampling temperature, between 0 and 1. Higher values like 0.8 increase randomness, while lower values like 0.2 make the output more focused and deterministic.

### Request Example
```bash
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

### Response
#### Success Response (200)
- **text** (string) - The translated text in English.

#### Response Example
```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```
```

--------------------------------

### conversation.item.truncate

Source: https://platform.openai.com/docs/api-reference/realtime-beta-server-events/response/content_part

Send this event to truncate a previous assistant message’s audio and synchronize the server's understanding of audio playback with the client.

```APIDOC
## conversation.item.truncate

### Description
Send this event to truncate a previous assistant message’s audio. The server will produce audio faster than realtime, so this event is useful when the user interrupts to truncate audio that has already been sent to the client but not yet played. This will synchronize the server's understanding of the audio with the client's playback.
Truncating audio will delete the server-side text transcript to ensure there is not text in the context that hasn't been heard by the user.
If successful, the server will respond with a `conversation.item.truncated` event.

### Event Type
conversation.item.truncate

### Request Body
- **audio_end_ms** (integer) - Required - Inclusive duration up to which audio is truncated, in milliseconds. If the audio_end_end_ms is greater than the actual audio duration, the server will respond with an error.
- **content_index** (integer) - Required - The index of the content part to truncate. Set this to `0`.
- **event_id** (string) - Optional - Client-generated ID used to identify this event.
- **item_id** (string) - Required - The ID of the assistant message item to truncate. Only assistant message items can be truncated.
- **type** (string) - Required - The event type, must be `conversation.item.truncate`.

### Request Example
```json
{
    "event_id": "event_678",
    "type": "conversation.item.truncate",
    "item_id": "item_002",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

### Response
#### Success Response
If successful, the server will respond with a `conversation.item.truncated` event.
```
