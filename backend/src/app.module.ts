import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/note.entity'; // Import your Note entity
import { Tag } from './notes/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db', // Name of the SQLite database file
      entities: [Note, Tag], // Register your entities here
      synchronize: true, // Auto-create tables (disable in production)
    }),
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
