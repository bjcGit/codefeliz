const { Schema, model } = require('mongoose');

const CodeSchema = Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    isWinner: {
        type: Boolean,
        default: false
    },
    claimedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    claimedAt: {
        type: Date,
        default: null
    }
});

module.exports = model('Code', CodeSchema);
