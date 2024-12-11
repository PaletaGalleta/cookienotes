import {
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './note.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(
    @Query('tag') tag: string,
    @Query('archived') showArchived: string,
  ): Promise<Note[]> {
    return this.notesService.findAll(tag, showArchived === 'true'); // Convert 'archived' to a boolean
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findOne(+id);
  }

  @Post()
  create(@Body() note: Partial<Note>): Promise<Note> {
    return this.notesService.create(note);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() note: Partial<Note>): Promise<Note> {
    return this.notesService.update(+id, note);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.notesService.remove(+id);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string): Promise<Note> {
    return this.notesService.archive(+id);
  }

  @Patch(':id/tags')
  updateTags(
    @Param('id') id: string,
    @Body() { tags }: { tags: string[] }, // Ensure tags is a string array
  ): Promise<Note> {
    return this.notesService.updateTags(+id, tags);
  }
}
