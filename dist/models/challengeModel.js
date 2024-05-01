"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipationType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ParticipationType;
(function (ParticipationType) {
    ParticipationType["Team"] = "Team";
    ParticipationType["Individual"] = "Individual";
})(ParticipationType || (exports.ParticipationType = ParticipationType = {}));
const challengeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Challenge must have a name'],
    },
    description: String,
    coverPhoto: String,
    participationType: {
        type: String,
        enum: ParticipationType,
        default: ParticipationType.Individual,
    },
    participants: {
        type: [
            {
                type: mongoose_1.default.Schema.ObjectId,
            },
        ],
        default: [],
    },
    startTime: {
        type: Date,
        required: [true, 'Challenge must have a start time'],
    },
    endTime: {
        type: Date,
        required: [true, 'Challenge must have an end time'],
    },
    rules: String,
    minTeamParticipants: { type: Number, default: 1 },
    maxTeamParticipants: { type: Number, default: 10 },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
challengeSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const refModel = this.participationType === ParticipationType.Team ? 'Team' : 'User';
        // add ref to participants based on participationType
        this.schema.paths.participants.options.ref = refModel;
    });
});
const Challenge = mongoose_1.default.model('Challenge', challengeSchema);
exports.default = Challenge;
