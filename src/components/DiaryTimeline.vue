<script setup lang="ts">
import { computed } from "vue";
import rawEntries from "../assets/data.js";
import type { DiaryEntry } from "../types/diary";
import { prepareAndSortDiary } from "../utils/diary";

const entries = rawEntries as DiaryEntry[];

const sortedEntries = computed(() =>
  prepareAndSortDiary(entries, import.meta.env.BASE_URL),
);
</script>

<template>
  <div class="diary">
    <header class="diary-header">
      <p class="diary-kicker">Journal</p>
      <h1 class="diary-title">日记</h1>
      <p class="diary-lead">如实记下这一天。</p>
    </header>

    <ol class="diary-list">
      <li
        v-for="entry in sortedEntries"
        :key="`${entry.date}|${entry.time}|${entry.title}`"
        class="diary-item"
      >
        <div class="diary-meta">
          <span class="diary-date">{{ entry.date }}</span>
          <span class="diary-time" aria-hidden="true">·</span>
          <span class="diary-time">{{ entry.time }}</span>
        </div>
        <h2 class="diary-entry-title">{{ entry.title }}</h2>
        <div
          v-if="entry.display.kind === 'html'"
          class="entry-body"
          v-html="entry.display.html"
        />
        <div v-else class="entry-body entry-body--plain">
          <p v-for="(para, i) in entry.display.paragraphs" :key="i">{{ para }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.diary {
  padding: 3rem 1.5rem 4rem;
  max-width: 42rem;
  margin: 0 auto;
  text-align: left;
}

.diary-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--diary-rule);
}

.diary-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--diary-muted);
  font-family: var(--diary-sans);
}

.diary-title {
  margin: 0 0 0.75rem;
  font-family: var(--diary-serif);
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--diary-ink);
}

.diary-lead {
  margin: 0;
  font-family: var(--diary-sans);
  font-size: 1rem;
  line-height: 1.65;
  color: var(--diary-muted);
}

.diary-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.diary-item {
  margin: 0;
  padding: 2.25rem 0;
  border-bottom: 1px solid var(--diary-rule);
}

.diary-item:first-of-type {
  padding-top: 0;
}

.diary-meta {
  margin: 0 0 0.5rem;
  font-family: var(--diary-sans);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: var(--diary-muted);
}

.diary-time[aria-hidden="true"] {
  margin: 0 0.35rem;
  letter-spacing: 0;
}

.diary-entry-title {
  margin: 0 0 1rem;
  font-family: var(--diary-serif);
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--diary-ink);
}

.entry-body {
  font-family: var(--diary-sans);
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--diary-body);
}

.entry-body--plain p {
  margin: 0 0 1rem;
}

.entry-body--plain p:last-child {
  margin-bottom: 0;
}

.entry-body :deep(p) {
  margin: 0 0 1rem;
}

.entry-body :deep(p:last-child) {
  margin-bottom: 0;
}

/* 媒体统一上限：比正文栏更窄，避免占满屏 */
.entry-body :deep(img) {
  display: block;
  max-width: min(100%, 17rem);
  width: auto;
  height: auto;
  max-height: min(70vh, 22rem);
  margin: 1rem 0;
  border-radius: 5px;
  border: 1px solid var(--diary-media-border);
  box-shadow: var(--diary-media-shadow);
  background: var(--diary-media-bg);
  object-fit: contain;
}

/* figure：说明叠在图片底部（覆盖层） */
.entry-body :deep(figure) {
  position: relative;
  display: inline-block;
  max-width: min(100%, 17rem);
  margin: 1rem 0;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--diary-media-border);
  box-shadow: var(--diary-media-shadow);
  vertical-align: middle;
}

.entry-body :deep(figure img) {
  display: block;
  margin: 0;
  max-width: 100%;
  width: 100%;
  height: auto;
  max-height: min(70vh, 22rem);
  object-fit: contain;
  border: none;
  border-radius: 0;
  box-shadow: none;
  background: var(--diary-media-bg);
}

.entry-body :deep(figcaption) {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 1.25rem 0.5rem 0.4rem;
  font-family: var(--diary-sans);
  font-size: 0.75rem;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.96);
  font-style: italic;
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.35) 45%, transparent 100%);
  pointer-events: none;
}

.entry-body :deep(p:has(img:only-child)) {
  margin: 1rem 0;
}

.entry-body :deep(p:has(img:only-child) img) {
  margin: 0;
}

/* 视频：与图片同量级宽度 */
.entry-body :deep(video) {
  display: block;
  width: auto;
  max-width: min(100%, 17rem);
  height: auto;
  max-height: min(70vh, 22rem);
  margin: 1rem 0;
  border-radius: 6px;
  border: 1px solid var(--diary-media-border);
  box-shadow: var(--diary-media-shadow);
  background: #1c1917;
  object-fit: contain;
}

.entry-body :deep(p:has(video:only-child)) {
  margin: 1rem 0;
}

.entry-body :deep(p:has(video:only-child) video) {
  margin: 0;
}

.entry-body :deep(time) {
  font-variant-numeric: tabular-nums;
  color: var(--diary-muted);
}
</style>
