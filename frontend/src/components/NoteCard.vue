<template>
    <div class="card-elevated clickable" @click="$emit('edit')">
        <div class="cardcontent gap-3">
            <span class="body-lg text-bold">{{ note.title }}</span>
            <span class="body-md">{{ note.content }}</span>

            <div class="row" v-if="note.tags && note.tags.length > 0">
                <div class="row gap-2 flex-align-center">
                    <div
                        v-for="(tag, index) in note.tags"
                        :key="index"
                        class="Chip Chip-assist outlined noclick body-sm"
                        @click="removeTag(index)">
                        {{ tag.name }}
                    </div>
                </div>
            </div>
        </div>
        <div class="buttonarea mt-3 p-1">
            <!-- Archive/Unarchive Button -->
            <div @click.stop="toggleArchive" class="button-icon-text">{{ note.isArchived ? "Unarchive" : "Archive" }}</div>
            <!-- Delete Button -->
            <div @click.stop="$emit('delete')" class="button-icon-text text-error">delete</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        note: Object,
    },
    data() {
        return {
            newTag: "", // Bind to the input for adding new tags
        };
    },
    methods: {
        // Toggle archive/unarchive state
        toggleArchive() {
            this.$emit("toggle-archive", this.note.id);
        },

        // Add a new tag to the note
        addTag() {
            if (this.newTag.trim()) {
                // Create the tag string array
                const aTags = this.note.tags.map(tag => tag.name);
                const updatedTags = [...aTags, this.newTag.trim()];
                // Emit both the note's ID and the updated tags array to the parent
                this.$emit("update-tags", updatedTags);
                this.newTag = ""; // Clear the input field after adding the tag
            }
        },

        // Remove a tag from the note
        removeTag(tagToRemove) {
            const aTags = this.note.tags.map(tag => tag.name);
            const updatedTags = aTags.filter(tag => tag !== tagToRemove.name);
            this.$emit("update-tags", updatedTags); // Send updated tags back to parent
        },
    },
};
</script>

<style scoped>
.note-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
}

.tag {
    display: inline-block;
    margin-right: 5px;
    padding: 5px;
    background-color: #f0f0f0;
    border-radius: 5px;
}

button {
    margin-top: 10px;
}
</style>
