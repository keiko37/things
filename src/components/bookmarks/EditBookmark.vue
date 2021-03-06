<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookmarksStore } from '@/stores/bookmarks'
import BorderButton from '@/components/global/BorderButton.vue'
import AppIcon from '@/components/global/AppIcon.vue'

const bookmarksStore = useBookmarksStore()
const { editableBookmark } = storeToRefs(bookmarksStore)
const { toggleIsBookmarkEditing, setEditableBookmark, addToBookmarks, updateBookmark } =
  bookmarksStore

function backToList() {
  toggleIsBookmarkEditing()
  setEditableBookmark(null)
}

const name = ref<string>('')
const nameInvalid = ref<boolean>(false)
const link = ref<string>('')
const linkInvalid = ref<boolean>(false)

function addBookmark() {
  nameInvalid.value = name.value.length <= 0
  linkInvalid.value = link.value.length <= 0

  if (nameInvalid.value || linkInvalid.value) {
    setTimeout(() => {
      nameInvalid.value = false
      linkInvalid.value = false
    }, 500)
    return
  }
  let protocol = link.value.match(/^([a-zA-Z]+):\/\//)
  let bookmarkIcon = buildIconUrl(link.value)
  const newBookmark = {
    id: editableBookmark.value !== null ? editableBookmark.value.id : Date.now(),
    name: name.value,
    link: protocol !== null ? link.value : `http://${link.value}`,
    icon: bookmarkIcon,
  }
  if (editableBookmark.value !== null) {
    updateBookmark(editableBookmark.value, newBookmark)
    setEditableBookmark(null)
    toggleIsBookmarkEditing()
    return
  }
  addToBookmarks(newBookmark)
  toggleIsBookmarkEditing()
}

function buildIconUrl(url: string) {
  const protocol = url.match(/^([a-zA-Z]+):\/\//)
  if (protocol !== null && (protocol[0] === 'https://' || protocol[0] === 'http://')) {
    const cleanUrl = url.match(/https?:\/\/(?:www\.|)([\w.-]+).*/gm)
    if (cleanUrl === null) {
      throw new Error('buildIconUrl: clean url has no matches.')
    }
    const resultLink = `https://api.statvoo.com/favicon/?url=${cleanUrl}`
    return resultLink
  }
  if (protocol === null) {
    const resultLink = `https://api.statvoo.com/favicon/?url=http://${url}`
    return resultLink
  }
  if (protocol !== null && protocol[0] === 'ftp://') {
    const cleanUrl = url.match(/(?<=@)[^/]+/)
    if (cleanUrl === null) {
      throw new Error('buildIconUrl: clean url has no matches.')
    }
    const resultLink = `https://api.statvoo.com/favicon/?url=http://${cleanUrl}`
    return resultLink
  }
  return url
}

onMounted(() => {
  if (editableBookmark.value) {
    name.value = editableBookmark.value.name
    link.value = editableBookmark.value.link
  }
})
</script>

<template>
  <div class="bookmarks__edit">
    <div @click="backToList" class="icon-btn">
      <AppIcon name="arrow_back" />
    </div>
    <form class="form">
      <div class="input-group">
        <input :class="{ invalid: nameInvalid }" v-model.trim="name" id="name" type="text" />
        <label for="name">name</label>
      </div>

      <div class="input-group">
        <input :class="{ invalid: linkInvalid }" v-model.trim="link" id="link" type="text" />
        <label for="link">link</label>
      </div>

      <BorderButton
        @click.enter.prevent="addBookmark"
        class="submit-button"
        :text="editableBookmark ? 'edit link' : 'add link'"
        >submit</BorderButton
      >
    </form>
  </div>
</template>

<style lang="scss" scoped>
.bookmarks__edit {
  padding: 0 5px 10px 5px;
}
.bookmarks__back {
  width: 100%;
  cursor: pointer;

  display: flex;
  flex-direction: column;

  &__icon {
    align-self: flex-end;
  }
  &:hover > &__icon {
    opacity: 0.8;
  }
}
.form {
  display: flex;
  flex-direction: column;
  padding: 15px 10px 0 10px;
  & input {
    background-color: transparent;
    border-bottom: 1px solid var(--border-color-active);
    outline: none;
    color: var(--text-color);
    caret-color: var(--border-color);
    margin-bottom: 15px;
    transition: all 0.4s;
    order: 2;
    &:focus {
      border-color: var(--border-color-active);
    }
    &:focus ~ label {
      color: var(--text-color);
    }
  }
  & label {
    transition: all 0.4s;
    text-transform: uppercase;
    &:focus {
      font-size: 20px;
    }
  }
}
.input-group {
  display: flex;
  flex-direction: column;
}
.invalid {
  border-color: brown !important;
}
</style>
