import { Test, TestingModule } from "@nestjs/testing";

import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException } from "@nestjs/common";
import { Note } from "../shema/note.shema";
import { NotesService } from "../notes.service";

describe("NotesService", () => {
	let service: NotesService;

	const mockNote = {
		_id: "123",
		title: "test8",
		content: "test3",
		tags: ["tag1", "tag3"],
	};

	const mockSave = jest.fn().mockResolvedValue(mockNote);

	const mockNoteModel = jest.fn().mockImplementation(() => ({
		save: mockSave,
	}));

	(mockNoteModel as any).find = jest.fn().mockReturnThis();
	(mockNoteModel as any).findById = jest.fn().mockReturnThis();
	(mockNoteModel as any).findByIdAndUpdate = jest.fn().mockReturnThis();
	(mockNoteModel as any).findByIdAndDelete = jest.fn().mockReturnThis();
	(mockNoteModel as any).exec = jest.fn();

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NotesService,
				{
					provide: getModelToken(Note.name),
					useValue: mockNoteModel,
				},
			],
		}).compile();

		service = module.get<NotesService>(NotesService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should create a note", async () => {
		const result = await service.create({
			title: "test8",
			content: "test3",
			tags: ["tag1", "tag3"],
		});
		expect(result).toEqual(mockNote);
		expect(mockSave).toHaveBeenCalled();
	});

	it("should find all notes", async () => {
		(mockNoteModel as any).find.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue([mockNote]);

		const result = await service.findAll();
		expect(result).toEqual([mockNote]);
		expect((mockNoteModel as any).find).toHaveBeenCalled();
	});

	it("should find notes by tag", async () => {
		(mockNoteModel as any).find.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue([mockNote]);

		const result = await service.findAll("tag1");
		expect(result).toEqual([mockNote]);
		expect((mockNoteModel as any).find).toHaveBeenCalledWith({ tags: "tag1" });
	});

	it("should find one note by id", async () => {
		(mockNoteModel as any).findById.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue(mockNote);

		const result = await service.findOne("123");
		expect(result).toEqual(mockNote);
	});

	it("should throw if note not found in findOne", async () => {
		(mockNoteModel as any).findById.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue(null);

		await expect(service.findOne("not-found")).rejects.toThrow(
			NotFoundException,
		);
	});

	it("should update a note", async () => {
		const updatedNote = { ...mockNote, title: "updated" };
		(mockNoteModel as any).findByIdAndUpdate.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue(updatedNote);

		const result = await service.update("123", { title: "updated" });
		expect(result).toEqual(updatedNote);
		expect((mockNoteModel as any).findByIdAndUpdate).toHaveBeenCalledWith(
			"123",
			{ title: "updated" },
			{ new: true },
		);
	});

	it("should throw if note not found in update", async () => {
		(mockNoteModel as any).findByIdAndUpdate.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue(null);

		await expect(
			service.update("not-found", { title: "updated" }),
		).rejects.toThrow(NotFoundException);
	});

	it("should remove a note", async () => {
		(mockNoteModel as any).findByIdAndDelete.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue(mockNote);

		await expect(service.remove("123")).resolves.toBeUndefined();
		expect((mockNoteModel as any).findByIdAndDelete).toHaveBeenCalledWith(
			"123",
		);
	});

	it("should throw if note not found in remove", async () => {
		(mockNoteModel as any).findByIdAndDelete.mockReturnThis();
		(mockNoteModel as any).exec.mockResolvedValue(null);

		await expect(service.remove("not-found")).rejects.toThrow(
			NotFoundException,
		);
	});
});
