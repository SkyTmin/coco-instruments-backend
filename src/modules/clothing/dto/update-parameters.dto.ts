import { PartialType } from '@nestjs/swagger';
import { SaveParametersDto } from './save-parameters.dto';

export class UpdateParametersDto extends PartialType(SaveParametersDto) {}