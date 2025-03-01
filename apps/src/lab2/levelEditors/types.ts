export interface LevelPredictSettings {
  isPredictLevel: boolean;
  solution?: string | string[];
  questionType?: PredictQuestionType;
  allowMultipleAttempts?: boolean;
  // Free Response settings
  freeResponseHeight?: number;
  placeholderText?: string;
  // Multiple choice settings
  multipleChoiceOptions?: string[];
  multipleChoiceAnswers?: string[];
  isMultiSelect?: boolean;
}

export enum PredictQuestionType {
  FreeResponse = 'freeResponse',
  MultipleChoice = 'multipleChoice',
}
