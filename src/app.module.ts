import { Module } from "@nestjs/common";

import { MongooseModule } from "@nestjs/mongoose";
import { NotesModule } from "./modules/notes/notes.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			process.env.MONGO_DB!,
		),
		NotesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
