import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Note } from '../notes/note.entity'; // Import the Note entity

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Many-to-many relation with notes
  @ManyToMany(() => Note, (note) => note.tags) // Many notes can have many tags
  notes: Note[];
}
