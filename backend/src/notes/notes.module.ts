import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './note.entity';
import { Tag } from './tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, Tag]), // Register both Note and Tag entities
  ],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
