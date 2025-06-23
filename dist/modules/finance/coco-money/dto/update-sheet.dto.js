"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSheetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_sheet_dto_1 = require("./create-sheet.dto");
class UpdateSheetDto extends (0, swagger_1.PartialType)(create_sheet_dto_1.CreateSheetDto) {
}
exports.UpdateSheetDto = UpdateSheetDto;
//# sourceMappingURL=update-sheet.dto.js.map