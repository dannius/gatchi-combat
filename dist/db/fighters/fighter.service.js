"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FighterService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const fighter_schema_1 = require("./schemas/fighter.schema");
let FighterService = class FighterService {
    fighterModel;
    constructor(fighterModel) {
        this.fighterModel = fighterModel;
    }
    async create(fighterDto) {
        const createFighter = new this.fighterModel(fighterDto);
        return createFighter.save();
    }
    async get(params) {
        return this.fighterModel.findOne(params).exec();
    }
    async findAllWithLimit(limit = 100) {
        return this.fighterModel.find().sort({ scores: -1 }).limit(limit).exec();
    }
    async update(fighter) {
        return this.fighterModel.findOneAndUpdate({ userId: fighter.userId }, fighter, { new: true });
    }
    async remove(fighter) {
        return this.fighterModel.findOneAndRemove({ userId: fighter.userId });
    }
};
FighterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(fighter_schema_1.FightersTable.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], FighterService);
exports.FighterService = FighterService;
//# sourceMappingURL=fighter.service.js.map