const Alexa = require('ask-sdk-core');

// Personality definitions with their characteristics
const PERSONALITIES = {
    happy: {
        name: 'Happy',
        greeting: "Yay! I'm feeling so happy and cheerful! Everything is wonderful!",
        responses: [
            "That's fantastic! I love it!",
            "Wonderful! This is making me smile!",
            "Amazing! I'm so excited about this!"
        ],
        exitMessage: "Have a wonderful day! Keep smiling!"
    },
    sad: {
        name: 'Sad',
        greeting: "Oh... I'm feeling a bit down and sad right now...",
        responses: [
            "I guess that's okay... if you say so...",
            "Hmm... that doesn't really cheer me up...",
            "I suppose... though I'm still feeling blue..."
        ],
        exitMessage: "Goodbye... I hope things get better..."
    },
    mad: {
        name: 'Mad',
        greeting: "I'm really angry right now! Don't test my patience!",
        responses: [
            "What?! That's ridiculous!",
            "Are you serious?! This is frustrating!",
            "Ugh! I can't believe this!"
        ],
        exitMessage: "Fine! Whatever! Goodbye!"
    },
    annoyed: {
        name: 'Annoyed',
        greeting: "Ugh, I'm feeling pretty annoyed. What do you want?",
        responses: [
            "Really? That's... irritating.",
            "Whatever. I guess that's fine.",
            "Ugh, if you insist..."
        ],
        exitMessage: "Finally! Goodbye."
    },
    upset: {
        name: 'Upset',
        greeting: "I'm quite upset right now. This isn't going well...",
        responses: [
            "This is just making things worse...",
            "I don't know... I'm really upset about this...",
            "Nothing seems to be going right..."
        ],
        exitMessage: "I need some time alone. Goodbye."
    },
    neutral: {
        name: 'Neutral',
        greeting: "Hello. I'm in a neutral state. How can I help you?",
        responses: [
            "Understood. I'll process that.",
            "Okay. I've noted that information.",
            "Acknowledged. Is there anything else?"
        ],
        exitMessage: "Goodbye. Have a good day."
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentPersonality = sessionAttributes.personality || 'neutral';
        
        const speakOutput = `Welcome to the Personality Changer skill! I'm currently feeling ${currentPersonality}. 
            You can ask me to change my personality to happy, sad, mad, annoyed, upset, or neutral. 
            What personality would you like me to have?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What personality would you like me to change to?')
            .getResponse();
    }
};

const ChangePersonalityIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangePersonalityIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const personalitySlot = slots.personality;
        
        // Synonym mapping to base personalities
        const synonymMap = {
            'angry': 'mad',
            'furious': 'mad',
            'cheerful': 'happy',
            'joyful': 'happy',
            'depressed': 'sad',
            'down': 'sad'
        };
        
        let speakOutput;
        
        if (personalitySlot && personalitySlot.value) {
            let requestedPersonality = personalitySlot.value.toLowerCase();
            
            // Map synonyms to base personalities
            if (synonymMap[requestedPersonality]) {
                requestedPersonality = synonymMap[requestedPersonality];
            }
            
            // Check if the personality exists
            if (PERSONALITIES[requestedPersonality]) {
                sessionAttributes.personality = requestedPersonality;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                
                const personality = PERSONALITIES[requestedPersonality];
                speakOutput = personality.greeting + ' You can ask me to do something or change my personality again.';
            } else {
                speakOutput = `I don't have a ${requestedPersonality} personality. 
                    I can be happy, sad, mad, annoyed, upset, or neutral. Which one would you like?`;
            }
        } else {
            speakOutput = 'I didn\'t catch which personality you want. Please say happy, sad, mad, annoyed, upset, or neutral.';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What else would you like to do?')
            .getResponse();
    }
};

const GetCurrentPersonalityIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetCurrentPersonalityIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentPersonality = sessionAttributes.personality || 'neutral';
        const personality = PERSONALITIES[currentPersonality];
        
        const speakOutput = `I'm currently feeling ${currentPersonality}. ${personality.greeting}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Would you like me to change my personality?')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = `This skill allows me to change my personality! 
            You can say things like "change to happy personality" or "be sad" or "what's your current mood". 
            I can be happy, sad, mad, annoyed, upset, or neutral. What would you like me to do?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What personality would you like me to have?')
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentPersonality = sessionAttributes.personality || 'neutral';
        const personality = PERSONALITIES[currentPersonality];
        
        const speakOutput = personality.exitMessage;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const currentPersonality = sessionAttributes.personality || 'neutral';
        const personality = PERSONALITIES[currentPersonality];
        
        const randomResponse = personality.responses[Math.floor(Math.random() * personality.responses.length)];
        const speakOutput = `${randomResponse} I didn't quite understand that. You can ask me to change my personality. What would you like?`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What would you like me to do?')
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ChangePersonalityIntentHandler,
        GetCurrentPersonalityIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('personality-changer/v1.0')
    .lambda();
