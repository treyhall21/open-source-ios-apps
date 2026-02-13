# Alexa Personality Changer Skill

An Amazon Alexa skill that allows users to change Alexa's personality and mood dynamically during conversation. Alexa can switch between different emotional states including Happy, Sad, Mad, Annoyed, Upset, and Neutral, with each personality having unique responses and characteristics.

## Features

- **Multiple Personalities**: Six distinct personalities with unique characteristics
  - **Happy**: Cheerful, enthusiastic, and positive
  - **Sad**: Melancholic, down, and gloomy
  - **Mad**: Angry, frustrated, and irritated
  - **Annoyed**: Irritated, bothered, and impatient
  - **Upset**: Distressed, troubled, and concerned
  - **Neutral**: Calm, balanced, and professional

- **Dynamic Responses**: Each personality has customized greetings, responses, and exit messages
- **Easy Switching**: Change personalities with simple voice commands
- **Current Mood Query**: Ask Alexa about her current personality state

## How to Use

### Starting the Skill
```
"Alexa, open personality changer"
```

### Changing Personality
```
"Change to happy"
"Be sad"
"Switch to mad personality"
"Change mood to annoyed"
"Become upset"
"Act neutral"
```

### Checking Current Personality
```
"What's your personality?"
"What's your current mood?"
"How are you feeling?"
```

### Getting Help
```
"Help"
```

### Stopping the Skill
```
"Stop"
"Cancel"
```

## Installation & Deployment

### Prerequisites
- Node.js (v14.x or later)
- AWS Account with Lambda access
- Amazon Developer Account
- ASK CLI (Alexa Skills Kit Command Line Interface)

### Setup Instructions

1. **Install Dependencies**
   ```bash
   cd lambda
   npm install
   ```

2. **Deploy to AWS Lambda**
   - Create a new Lambda function in AWS Console
   - Upload the `lambda` directory contents as a ZIP file
   - Set the handler to `index.handler`
   - Configure appropriate IAM role with CloudWatch Logs permissions
   - Note the Lambda function ARN (e.g., `arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:YOUR_FUNCTION_NAME`)

3. **Create the Alexa Skill**
   - Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
   - Create a new Custom Skill
   - Set the invocation name to "personality changer"
   - Import the interaction model from `skill-package/interactionModels/custom/en-US.json`
   - Update the endpoint in `skill-package/skill.json` with your actual Lambda ARN
   - **IMPORTANT**: Replace the placeholder ARN `arn:aws:lambda:us-east-1:123456789012:function:personality-changer` with your actual Lambda function ARN

4. **Build and Test**
   - Build the interaction model in the Alexa Developer Console
   - Test using the Test tab or an Alexa-enabled device

### Using ASK CLI (Alternative Method)

```bash
# Install ASK CLI
npm install -g ask-cli

# Configure ASK CLI
ask configure

# Deploy the skill
ask deploy

# Test the skill
ask dialog --locale en-US
```

## Project Structure

```
alexa-personality-skill/
├── lambda/
│   ├── index.js          # Main Lambda function code
│   └── package.json      # Node.js dependencies
├── skill-package/
│   ├── interactionModels/
│   │   └── custom/
│   │       └── en-US.json    # Voice interaction model
│   └── skill.json        # Skill manifest
└── README.md             # This file
```

## Technical Details

### Skill Information
- **Invocation Name**: personality changer
- **Category**: Novelty and Humor
- **Runtime**: Node.js 14.x
- **SDK**: Alexa Skills Kit SDK for Node.js v2

### Intents
- `ChangePersonalityIntent`: Changes Alexa's personality
- `GetCurrentPersonalityIntent`: Retrieves current personality state
- `AMAZON.HelpIntent`: Provides help information
- `AMAZON.StopIntent`: Exits the skill
- `AMAZON.CancelIntent`: Cancels current action
- `AMAZON.FallbackIntent`: Handles unrecognized input

### Session Attributes
The skill uses session attributes to maintain the current personality state throughout the conversation.

## Development

### Adding New Personalities

To add a new personality, edit `lambda/index.js` and add a new entry to the `PERSONALITIES` object:

```javascript
newPersonality: {
    name: 'NewPersonality',
    greeting: "Greeting message",
    responses: [
        "Response 1",
        "Response 2",
        "Response 3"
    ],
    exitMessage: "Exit message"
}
```

Then update the interaction model in `skill-package/interactionModels/custom/en-US.json` to include the new personality type.

### Testing Locally

You can test the Lambda function locally using the ASK CLI:

```bash
ask run
```

Or use unit testing frameworks like Jest or Mocha to test individual handlers.

## Privacy & Security

- This skill does not collect or store any personal information
- No user data is transmitted outside of the Alexa ecosystem
- Session data is temporary and cleared when the skill session ends

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please refer to the repository's issue tracker.

## Acknowledgments

Built using the Alexa Skills Kit SDK for Node.js.
