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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupSchema = exports.GroupsTable = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let GroupsTable = class GroupsTable {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], GroupsTable.prototype, "groupId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Map)
], GroupsTable.prototype, "fighters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], GroupsTable.prototype, "allowDailyQuote", void 0);
GroupsTable = __decorate([
    (0, mongoose_1.Schema)()
], GroupsTable);
exports.GroupsTable = GroupsTable;
exports.GroupSchema = mongoose_1.SchemaFactory.createForClass(GroupsTable);
//# sourceMappingURL=group.schema.js.map