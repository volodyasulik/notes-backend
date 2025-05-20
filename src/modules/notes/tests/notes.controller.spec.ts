import { Test, TestingModule } from "@nestjs/testing";
import { NotesController } from "../notes.controller";
import { NotesService } from "../notes.service";
import { CreateNoteDto } from "../dtos/create-note.dto";
import { UpdateNoteDto } from "../dtos/update-note.dto";

describe("NotesController", () => {
	let controller: NotesController;

	const testNote = {
		_id: "123",
		title: "test8",
		content: "test3",
		tags: ["tag1", "tag3"],
	};

	const mockNotesService = {
		create: jest.fn().mockResolvedValue(testNote),
		findAll: jest.fn().mockResolvedValue([testNote]),
		findOne: jest.fn().mockResolvedValue(testNote),
		update: jest
			.fn()
			.mockResolvedValue({ ...testNote, title: "updated title" }),
		remove: jest.fn().mockResolvedValue(undefined),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotesController],
			providers: [{ provide: NotesService, useValue: mockNotesService }],
		}).compile();

		controller = module.get<NotesController>(NotesController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should create a note", async () => {
		const dto: CreateNoteDto = {
			title: "test8",
			content: "test3",
			tags: ["tag1", "tag3"],
		};

		const result = await controller.create(dto);
		expect(result).toEqual(testNote);
		expect(mockNotesService.create).toHaveBeenCalledWith(dto);
	});

	it("should return all notes", async () => {
		const result = await controller.findAll(undefined);
		expect(result).toEqual([testNote]);
		expect(mockNotesService.findAll).toHaveBeenCalledWith(undefined);
	});

	it("should return filtered notes by tag", async () => {
		await controller.findAll("tag3");
		expect(mockNotesService.findAll).toHaveBeenCalledWith("tag3");
	});

	it("should return one note by id", async () => {
		const result = await controller.findOne("123");
		expect(result).toEqual(testNote);
		expect(mockNotesService.findOne).toHaveBeenCalledWith("123");
	});

	it("should update a note", async () => {
		const dto: UpdateNoteDto = { title: "updated title" };
		const result = await controller.update("123", dto);
		expect(result.title).toBe("updated title");
		expect(mockNotesService.update).toHaveBeenCalledWith("123", dto);
	});

	it("should remove a note", async () => {
		const result = await controller.remove("123");
		expect(result).toBeUndefined();
		expect(mockNotesService.remove).toHaveBeenCalledWith("123");
	});
});
