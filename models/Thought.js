const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true, 
            minLength: 1, 
            maxLength: 280
        },
        
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username: {
            type: String, 
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            virtuals: true, 
            getters: true
        }
    }
);

const ReactionSchema = new Schema(
    {
        reactionId: {
            
        }
    }
)

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});



const ThoughtSchema = model('Thought', ThoughtSchema);

module.exports = Thought;