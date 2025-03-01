import React, {useState} from 'react';
import {LevelPredictSettings, PredictQuestionType} from '../types';
import {SimpleDropdown} from '@cdo/apps/componentLibrary/dropdown';
import Checkbox from '@cdo/apps/componentLibrary/checkbox';
import moduleStyles from './edit-predict-settings.module.scss';
import {BodyThreeText} from '@cdo/apps/componentLibrary/typography';
import FreeResponseFields from './FreeResponseFields';
import MultipleChoiceFields from './MultipleChoiceFields';

interface EditPredictSettingsProps {
  initialSettings: LevelPredictSettings;
}

const EditPredictSettings: React.FunctionComponent<
  EditPredictSettingsProps
> = ({initialSettings}) => {
  // Add default empty values to avoid errors
  const defaultSettings: LevelPredictSettings = {
    isPredictLevel: false,
    solution: '',
    questionType: PredictQuestionType.FreeResponse,
    allowMultipleAttempts: false,
    placeholderText: '',
    multipleChoiceOptions: [''],
    multipleChoiceAnswers: [],
    freeResponseHeight: 20,
  };

  const [predictSettings, setPredictSettings] = useState<LevelPredictSettings>(
    initialSettings ? {...defaultSettings, ...initialSettings} : defaultSettings
  );

  const handleIsPredictToggle = () => {
    setPredictSettings({
      ...predictSettings,
      isPredictLevel: !predictSettings.isPredictLevel,
      questionType:
        predictSettings.questionType || PredictQuestionType.FreeResponse,
    });
  };

  const handleQuestionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPredictSettings({
      ...predictSettings,
      questionType: e.target.value as PredictQuestionType,
    });
  };

  const renderMultipleChoiceOptions = () => {
    return (
      <MultipleChoiceFields
        predictSettings={predictSettings}
        setPredictSettings={setPredictSettings}
      />
    );
  };

  return (
    <div>
      <BodyThreeText>
        Predict levels are read only for students. Either a free response or
        multiple choice question is shown to students in the instructions panel.
        The student must answer the question before they can run the code.
        Specify the question in the long instructions.
      </BodyThreeText>
      <input
        id="level_predict_settings"
        name={'level[predict_settings]'}
        type="hidden"
        value={JSON.stringify(predictSettings)}
      />
      <Checkbox
        label="Set this level as a predict level"
        checked={predictSettings.isPredictLevel}
        onChange={handleIsPredictToggle}
        name="isPredictLevel"
      />
      {predictSettings?.isPredictLevel && (
        <div>
          <SimpleDropdown
            items={[
              {value: PredictQuestionType.FreeResponse, text: 'Free Response'},
              {
                value: PredictQuestionType.MultipleChoice,
                text: 'Multiple Choice',
              },
            ]}
            selectedValue={
              predictSettings.questionType || PredictQuestionType.FreeResponse
            }
            onChange={handleQuestionTypeChange}
            labelText="Question Type"
            name="Question Type"
            size="s"
            className={moduleStyles.fieldArea}
          />
          {predictSettings.questionType === PredictQuestionType.FreeResponse ? (
            <FreeResponseFields
              predictSettings={predictSettings}
              setPredictSettings={setPredictSettings}
            />
          ) : (
            renderMultipleChoiceOptions()
          )}
          <Checkbox
            label="Allow multiple tries"
            checked={predictSettings.allowMultipleAttempts || false}
            onChange={e =>
              setPredictSettings({
                ...predictSettings,
                allowMultipleAttempts: e.target.checked,
              })
            }
            name="allow_multiple_tries"
          />
        </div>
      )}
    </div>
  );
};

export default EditPredictSettings;
