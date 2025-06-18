// models/user.js
import mongoose from 'mongoose'; 

const userSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        required: true,
        unique: true // Essential: Each Telegram user has a unique ID
    },
    username: {
        type: String,
        // Telegram usernames are OPTIONAL. Users can interact with bots without one.
        // Making it 'required: true' will cause errors for users without a username.
        required: false,
        // Making it unique can also be problematic. If a user changes their username,
        // or if two users without usernames interact, this could cause issues.
        // It's generally better to rely on `telegramId` for uniqueness.
        unique: false, 
        sparse: true // Allows null values to not violate the unique constraint if it were true
    },
    firstName: {
        type: String,
        required: true // First name is almost always available
    },
    lastName: {
        type: String,
        required: false // Last name is optional on Telegram
    },
    languageCode: {
        type: String,
        required: false // Language code is also optional from Telegram's side
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    isPremium: {
        type: Boolean,
        default: false // This can be extracted from msg.from.is_premium
    },
    isBot: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false 
    },
    isActive: {
        type: Boolean,
        default: true // You can set to false for inactive users after a long time
    },
    lastInteraction: { // Renamed from lastSeen for clarity with 'last seen' in Telegram UI
        type: Date,
        default: Date.now
    },
   
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true // Ensures this field is only set once on creation
    }
});

// Add a pre-save hook to update lastInteraction on every save/update
userSchema.pre('save', function(next) {
    if (this.isModified() && !this.isNew) { // Only update if document is modified and not new
        this.lastInteraction = Date.now();
    }
    next();
});


const User = mongoose.model('User', userSchema);

export default User;