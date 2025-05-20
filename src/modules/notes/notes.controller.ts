import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Query,
	Body,
} from "@nestjs/common";

import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dtos/create-note.dto";
import { UpdateNoteDto } from "./dtos/update-note.dto";

@Controller("notes")
export class NotesController {
	constructor(private readonly notesService: NotesService) {}
	@Post()
	async create(@Body() createNoteDto: CreateNoteDto) {
	  return this.notesService.create(createNoteDto);
	}
	@Get()
async findAll(@Query('tag') tag?: string) {
  return this.notesService.findAll(tag);
}

	@Get(':id')
	async findOne(@Param('id') id: string) {
	  return this.notesService.findOne(id);
	}
	@Patch(':id')
	async update(
	  @Param('id') id: string,
	  @Body() updateNoteDto: UpdateNoteDto,
	) {
	  return this.notesService.update(id, updateNoteDto);
	}
	@Delete(':id')
	async remove(@Param('id') id: string) {
	  return this.notesService.remove(id);
	}
}
