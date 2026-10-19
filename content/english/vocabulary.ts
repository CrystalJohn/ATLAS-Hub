export type SavedWord={lessonId:string;version:1;word:string;savedAt:string};
export type VocabularyResponse={words:SavedWord[]};
export const vocabularyKey=(word:Pick<SavedWord,'lessonId'|'version'|'word'>)=>`${word.lessonId}:v${word.version}:${word.word}`;
