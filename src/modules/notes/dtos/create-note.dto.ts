import { IsString, IsOptional, IsArray, ArrayNotEmpty } from "class-validator";

export class CreateNoteDto {
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	content?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}
