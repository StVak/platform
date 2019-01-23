import { Component, Filter } from 'src/core/shopware';
import template from './sw-media-sidebar.html.twig';
import './sw-media-sidebar.scss';

Component.register('sw-media-sidebar', {
    template,

    props: {
        items: {
            required: true,
            type: Array,
            validator(value) {
                const invalidElements = value.filter((element) => {
                    return !['media', 'media_folder'].includes(element.entityName);
                });
                return invalidElements.length === 0;
            }
        },

        currentFolder: {
            type: Object,
            required: false,
            default: null,
            validator(value) {
                return value.entityName === 'media_folder';
            }
        }
    },

    data() {
        return {
            showModalReplace: false,
            showModalDelete: false,
            showFolderSettings: false,
            showFolderDissolve: false,
            showModalMove: false
        };
    },

    computed: {
        mediaNameFilter() {
            return Filter.getByName('mediaName');
        },

        hasItems() {
            return this.items.length > 0;
        },

        isSingleFile() {
            return this.items.length === 1;
        },

        isMultipleFile() {
            return this.items.length > 1;
        },

        headLine() {
            if (this.isSingleFile) {
                if (this.firstEntity.entityName === 'media') {
                    return this.mediaNameFilter(this.firstEntity);
                }
                return this.firstEntity.name;
            }

            if (this.isMultipleFile) {
                return this.getSelectedFilesCount;
            }

            if (this.currentFolder) {
                return this.currentFolder.name;
            }

            return '';
        },

        getSelectedFilesCount() {
            return `${this.$tc('sw-media.sidebar.labelHeadlineMultiple', this.items.length, { count: this.items.length })}`;
        },

        mediaItems() {
            return this.items.filter((item) => {
                return item.entityName === 'media';
            });
        },

        hasFolder() {
            return this.items.some((item) => {
                return item.entityName === 'media_folder';
            });
        },

        firstEntity() {
            return this.items[0];
        }
    },

    methods: {
        openModalReplace() {
            this.showModalReplace = true;
        },

        closeModalReplace() {
            this.showModalReplace = false;
        },

        openModalDelete() {
            this.showModalDelete = true;
        },

        closeModalDelete() {
            this.showModalDelete = false;
        },

        openFolderSettings() {
            this.showFolderSettings = true;
        },

        closeFolderSettings() {
            this.showFolderSettings = false;
        },

        deleteSelectedItems(deletePromise) {
            this.closeModalDelete();
            deletePromise.then((ids) => {
                this.$emit('sw-media-sidebar-items-delete', ids);
            });
        },

        openFolderDissolve() {
            this.showFolderDissolve = true;
        },

        closeFolderDissolve() {
            this.showFolderDissolve = false;
        },

        openModalMove() {
            this.showModalMove = true;
        },

        closeModalMove() {
            this.showModalMove = false;
        },

        onFolderDissolved(dissolvePromise) {
            this.closeFolderDissolve();
            dissolvePromise.then((ids) => {
                this.$emit('sw-media-sidebar-folder-items-dissolved', ids);
            });
        },

        onFolderMoved(movePromise) {
            this.closeModalMove();
            movePromise.then((ids) => {
                this.$emit('sw-media-sidebar-items-moved', ids);
            });
        }
    }
});
