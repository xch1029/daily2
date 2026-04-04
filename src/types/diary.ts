export interface DiaryEntry {
  date: string;
  time: string;
  title: string;
  content: string;
}

export interface PreparedDiaryEntry extends DiaryEntry {
  sortTimestamp: number;
  display: { kind: "html"; html: string } | { kind: "plain"; paragraphs: string[] };
}
