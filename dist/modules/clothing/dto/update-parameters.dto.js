"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateParametersDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const save_parameters_dto_1 = require("./save-parameters.dto");
class UpdateParametersDto extends (0, swagger_1.PartialType)(save_parameters_dto_1.SaveParametersDto) {
}
exports.UpdateParametersDto = UpdateParametersDto;
//# sourceMappingURL=update-parameters.dto.js.map