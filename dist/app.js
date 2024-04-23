"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appError_1 = __importDefault(require("./utils/appError"));
const cors_1 = __importDefault(require("cors"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
// importing routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const userProfileRoutes_1 = __importDefault(require("./routes/userProfileRoutes"));
const challengeTeamRoute_1 = __importDefault(require("./routes/challengeTeamRoute"));
const voteRoute_1 = __importDefault(require("./routes/voteRoute"));
const challengeRoute_1 = __importDefault(require("./routes/challengeRoute"));
const courseRoute_1 = __importDefault(require("./routes/courseRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10kb' }));
// GLOBAL MIDDLEWARES
// set security http
app.use((0, helmet_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
//including global middleware
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour',
});
// rate limiter
app.use('/api', limiter);
//comes in here to find the specified filed to be served as static content
app.use('/api/v1/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/profiles', userProfileRoutes_1.default);
app.use('/api/v1/courses', courseRoute_1.default);
app.use('/api/v1/challenges', challengeRoute_1.default);
app.use('/api/v1/votes', voteRoute_1.default);
app.use('/api/v1/teams', challengeTeamRoute_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'App is running successfully',
    });
});
app.all('*', (req, res, next) => {
    const message = `${req.originalUrl} route cannot be found on this server`;
    return next(new appError_1.default(message, 404));
});
app.use(errorController_1.default.globalSendError);
exports.default = app;
