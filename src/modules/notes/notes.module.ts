import { Module } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Note, NoteSchema } from "src/modules/notes/shema/note.shema";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
	],
	providers: [NotesService],
	controllers: [NotesController],
})
export class NotesModule {}
