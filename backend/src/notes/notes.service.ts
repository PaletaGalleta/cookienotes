import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Note } from './note.entity';
import { Tag } from './tag.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,

    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(tag?: string, showArchived: boolean = false): Promise<Note[]> {
    const queryBuilder = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tag'); // Include tags relation

    queryBuilder.andWhere('note.isArchived = :isArchived', {
      isArchived: showArchived,
    });

    if (tag) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('tag.name LIKE :exactMatch', { exactMatch: tag })
            .orWhere('tag.name LIKE :startsWith', { startsWith: `${tag}%` })
            .orWhere('tag.name LIKE :endsWith', { endsWith: `%${tag}` })
            .orWhere('tag.name LIKE :contains', { contains: `%${tag}%` });
        }),
      );
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return note;
  }

  async create(noteData: Partial<Note>): Promise<Note> {
    const newNote = this.notesRepository.create(noteData);
    return this.notesRepository.save(newNote);
  }

  async update(id: number, noteData: Partial<Note>): Promise<Note> {
    console.log(`Incoming note data: ${JSON.stringify(noteData)}`);
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    console.log(`Existing note data: ${JSON.stringify(note)}`);

    const textTags = noteData['textTags'];

    delete noteData['textTags'];

    // If there are any changes in the noteData, apply them
    if (JSON.stringify(noteData) !== JSON.stringify(note)) {
      console.log('Objects are different!');
      note.title = noteData.title || note.title;
      note.content = noteData.content || note.content;
      note.isArchived =
        noteData.isArchived !== undefined
          ? noteData.isArchived
          : note.isArchived;
    }

    console.log(`Note after merging: ${JSON.stringify(note)}`);

    // Update Tags
    const updatedTags = await Promise.all(
      textTags.map(async (tagName: string) => {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });

        // If the tag doesn't exist, create a new one
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          tag = await this.tagRepository.save(tag);
        }

        return tag;
      }),
    );

    // Update the note's tags
    note.tags = updatedTags;

    console.log(`Note after tags: ${JSON.stringify(note)}`);

    return this.notesRepository.save(note); // Save the updated note
  }

  async remove(id: number): Promise<void> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Note with ID ${id} not found`);
  }

  async archive(id: number): Promise<Note> {
    const note = await this.findOne(id);
    note.isArchived = !note.isArchived;
    return this.notesRepository.save(note);
  }

  async updateTags(id: number, tags: string[]): Promise<Note> {
    // Find the note by ID, including related tags
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['tags'], // Include related tags
    });

    if (!note) {
      throw new Error('Note not found');
    }

    const updatedTags = await Promise.all(
      tags.map(async (tagName) => {
        let tag = await this.tagRepository.findOne({
          where: { name: tagName },
        });

        // If the tag doesn't exist, create a new one
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          tag = await this.tagRepository.save(tag);
        }

        return tag;
      }),
    );

    // Update the note's tags
    note.tags = updatedTags;

    // Save and return the updated note
    return this.notesRepository.save(note);
  }
}
