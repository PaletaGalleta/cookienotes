<template>
    <div v-if="visible" class="modal fade modal-backdrop scroll show" id="editor" tabindex="-1">
        <div class="modal-dialog modal-xl show">
            <div class="modal-content">
                <form @submit.prevent="handleSubmit">
                    <div class="modal-header">
                        <h2 class="modal-title">{{ isEditing ? "Edit Note" : "Create Note" }}</h2>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <div class="textfield-filled open">
                                    <input
                                        type="text"
                                        v-model="formData.title"
                                        maxlength="64"
                                        autocomplete="chrome-off"
                                        required />
                                    <label>Title</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="textfield-filled open">
                                    <textarea type="text" v-model="formData.content" maxlength="128" required></textarea>
                                    <label>Content</label>
                                    <div class="placeholder d-flex">
                                        <span class="flex-gr-1"></span>
                                        <span class="counter">0/128</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="separator"></div>
                        <div class="row">
                            <div class="row gap-2 flex-align-center">
                                <span class="body-lg">Tags:</span>
                                <div
                                    v-for="(tag, index) in formData.textTags"
                                    :key="index"
                                    class="Chip Chip-filter elevated"
                                    @click="removeTag(index)">
                                    {{ tag }}
                                    <span class="icon filled body-lg">close</span>
                                </div>
                                <div class="col-12 col-md searcharea m-0 p-0">
                                    <form class="searchbar" @submit.prevent="addTag">
                                        <input
                                            @keyup.enter="addTag"
                                            v-model="newTag"
                                            class="searchfield withicon"
                                            type="text"
                                            placeholder="Add a tag"
                                            autocomplete="chrome-off"
                                            @input="fetchNotes" />
                                        <button type="submit" class="button-search br-0 icon">add</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <!-- <button type="button" class="button-text btn btn-primary" @click="close">Cancel</button> -->
                        <button type="submit" class="button-filled btn btn-primary">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: Boolean, // Controls visibility of the popup
        initialData: Object, // Data for pre-filling the form (optional)
        isEditing: Boolean, // Whether it's in edit mode
    },
    data() {
        return {
            formData: {
                id: -1,
                title: "",
                content: "",
                tags: [], // Initialize tags
            },
            newTag: "", // Input field for adding new tags
        };
    },
    watch: {
        // Watch for changes to initialData and update formData
        initialData: {
            handler(newValue) {
                if (newValue) {
                    this.formData = {...newValue, tags: newValue.tags || []}; // Ensure tags is an array
                    console.log(this.formData);
                    this.formData.textTags = newValue.tags.map(tag => tag.name);
                }
            },
            immediate: true, // Trigger on mount
        },
    },
    methods: {
        handleSubmit() {
            this.$emit("submit", this.formData.id, this.formData); // Emit the form data to parent
            this.close();
        },
        close() {
            this.$emit("close"); // Notify parent to close the popup
        },
        addTag() {
            const trimmedTag = this.newTag.trim();
            if (trimmedTag && !this.formData.textTags.includes(trimmedTag)) {
                this.formData.textTags.push(trimmedTag); // Add tag to the list
                this.newTag = ""; // Clear the input field
            }
        },
        removeTag(index) {
            this.formData.textTags.splice(index, 1); // Remove tag from the list
        },
    },
};
</script>
