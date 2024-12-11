<template>
    <div>
        <div class="container-fluid" style="height: 100vh" id="main-container">
            <div class="row flex-nowrap" style="min-height: 100vh">
                <div class="col p-0">
                    <nav class="top-bar top-bar-expand-lg bg-primary">
                        <div class="container-fluid flex-h flex-align-center">
                            <a class="top-bar-brand col col-sm-auto h-100 flex-justify-center" href="/">
                                <img src="/cookienotes.svg" />
                            </a>
                            <div class="top-bar-rand title-lg text-brand px-3">CookieNotes</div>
                            <div class="top-bar-gutter title-lg px-3 text-inverted d-none d-sm-block">
                                <div class="row flex-align-center flex-justify-end">
                                    <div class="col-12 col-md col-lg-6 col-xl-5 searcharea">
                                        <form class="searchbar">
                                            <input
                                                v-model="tagFilter"
                                                class="searchfield withicon"
                                                type="text"
                                                placeholder="Filter by tag"
                                                autocomplete="chrome-off"
                                                @input="fetchNotes" />
                                            <a class="button-search br-0 icon hidden" id="cleartext">cancel</a>
                                        </form>
                                    </div>
                                    <div class="col-lg"></div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <div class="container-sm flex-gr-1 mt-lg-4">
                        <div class="row flex-justify-center my-4">
                            <div class="col-8">
                                <div class="card-elevated">
                                    <div class="cardcontent">
                                        <div class="row mb-3">
                                            <div class="header-sm">Create a note</div>
                                        </div>
                                        <form @submit.prevent="addNote">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="textfield-filled">
                                                        <input
                                                            type="text"
                                                            v-model="newNote.title"
                                                            maxlength="64"
                                                            autocomplete="chrome-off"
                                                            required />
                                                        <label>Title</label>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="textfield-filled">
                                                        <textarea
                                                            type="text"
                                                            v-model="newNote.content"
                                                            maxlength="128"
                                                            required></textarea>
                                                        <label>Content</label>
                                                        <div class="placeholder d-flex">
                                                            <span class="flex-gr-1"></span>
                                                            <span class="counter">0/128</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="buttonarea mt-3">
                                                <button type="submit" class="button-filled">Add Note</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 gap-3">
                                <!-- Show Archived Notes Toggle -->
                                <div class="flex-h flex-align-center flex-wrap gap-2">
                                    <span class="body-md">Show Archived</span>
                                    <label class="switch">
                                        <input type="checkbox" v-model="showArchived" @change="fetchNotes" />
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div v-for="note in notes" :key="note.id" class="col-6 col-lg-3">
                                <NoteCard
                                    :note="note"
                                    @delete="confirmAndDeleteNote(note.id)"
                                    @toggle-archive="toggleArchive(note.id)"
                                    @update-tags="updateTags(note.id, $event)"
                                    @edit="openEditor(note)" />
                            </div>
                        </div>
                    </div>

                    <div id="footer" class="m-0 container-fluid">
                        <div class="row my-4">
                            <div class="container-xs">
                                <div class="row">
                                    <div class="col-12">
                                        <p class="label-sm center">
                                            © 2024
                                            <a href="https://www.linkedin.com/in/estradaoiram/" tabindex="-1"
                                                >Luis Mario Estrada Pereyra</a
                                            >
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Note Editor Popup -->
        <NoteEditor
            :visible="editorVisible"
            :initialData="editorData"
            :isEditing="isEditing"
            @submit="handleNoteSubmit"
            @close="closeEditor" />
    </div>
</template>

<script>
import api from "../api";
import NoteCard from "../components/NoteCard.vue";
import NoteEditor from "../components/NoteEditor.vue";

export default {
    components: {NoteCard, NoteEditor},
    data() {
        return {
            notes: [],
            newNote: {
                title: "",
                content: "",
            },
            tagFilter: "",
            showArchived: false, // Controls whether archived notes should be shown
            editorVisible: false, // Popup visibility
            editorData: null, // Data for editing (or null for creating)
            isEditing: false, // Editing mode flag
        };
    },
    methods: {
        async fetchNotes() {
            const response = await api.get("/notes", {
                params: {
                    tag: this.tagFilter,
                    archived: this.showArchived ? "true" : "false", // Send the archived filter to backend
                },
            });
            this.notes = response.data;
        },
        async addNote() {
            const response = await api.post("/notes", this.newNote);
            this.notes.push(response.data);
            this.newNote = {title: "", content: ""};
            this.fetchNotes();
        },
        async confirmAndDeleteNote(id) {
            const confirmed = window.confirm("Are you sure you want to delete this note?");
            if (confirmed) {
                await this.deleteNote(id);
            }
        },
        async deleteNote(id) {
            await api.delete(`/notes/${id}`);
            this.notes = this.notes.filter(note => note.id !== id);
        },
        async toggleArchive(noteId) {
            const updatedNote = await api.patch(`/notes/${noteId}/archive`);
            this.notes = this.notes.map(note => (note.id === updatedNote.id ? updatedNote : note));
            this.fetchNotes();
        },
        async updateTags(noteId, tags) {
            const updatedNote = await api.patch(`/notes/${noteId}/tags`, {tags});
            this.notes = this.notes.map(note => (note.id === updatedNote.id ? updatedNote : note));
            this.fetchNotes();
        },
        openEditor(note = null) {
            this.editorVisible = true;
            this.isEditing = !!note;
            this.editorData = note ? {...note} : {title: "", content: ""};
        },
        closeEditor() {
            this.editorVisible = false;
            this.editorData = null;
            this.isEditing = false;
        },
        async handleNoteSubmit(id, noteData) {
            try {
                await api.patch(`/notes/${this.editorData.id}`, noteData);
            } catch (e) {}
            this.fetchNotes();
            this.closeEditor();
        },
    },
    mounted() {
        this.fetchNotes();
    },
};
</script>
