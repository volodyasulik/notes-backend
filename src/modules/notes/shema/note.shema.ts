// src/notes/schemas/note.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Document } from "mongoose";

export type NoteDocument = Note & Document;

@Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
export class Note {
	@Prop({ required: true })
	title: string;

	@Prop()
	content?: string;

	@Prop({ type: [String] })
	tags?: string[];

	@Prop()
	createdAt: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
