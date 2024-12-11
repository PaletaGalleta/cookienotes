import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
} from 'typeorm';

import { Tag } from 'src/notes/tag.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Many-to-many relation with tags
  @ManyToMany(() => Tag, (tag) => tag.notes) // Many tags can belong to many notes
  @JoinTable()
  tags: Tag[];
}
