import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Note, NoteDocument } from './shema/note.shema';
import type { CreateNoteDto } from './dtos/create-note.dto';
import type { UpdateNoteDto } from './dtos/update-note.dto';

@Injectable()
export class NotesService {

  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll(tag?: string): Promise<Note[]> {
    if (tag) {
      return this.noteModel.find({ tags: tag }).exec();
    }
    return this.noteModel.find().exec();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const updated = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
    }).exec();
    if (!updated) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const res = await this.noteModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }
}