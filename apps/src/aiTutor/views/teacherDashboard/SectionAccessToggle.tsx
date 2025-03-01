import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {handleUpdateSectionAITutorEnabled} from '@cdo/apps/aiTutor/accessControlsApi';
import ToggleSwitch from '@cdo/apps/code-studio/components/ToggleSwitch';
import InfoHelpTip from '@cdo/apps/lib/ui/InfoHelpTip';
import {updateSectionAiTutorEnabled} from '@cdo/apps/templates/teacherDashboard/teacherSectionsRedux';
import {useAppDispatch} from '@cdo/apps/util/reduxHooks';
import i18n from '@cdo/locale';

import style from '@cdo/apps/aiTutor/views/teacherDashboard/access-controls.module.scss';

interface SectionAccessToggleProps {
  sectionId: number;
}

interface SectionsData {
  [index: number]: {
    aiTutorEnabled: boolean;
  };
}

const SectionAccessToggle: React.FC<SectionAccessToggleProps> = ({
  sectionId,
}) => {
  const sectionList = useSelector(
    (state: {teacherSections: {sections: SectionsData}}) =>
      state.teacherSections.sections
  );

  const [aiTutorEnabled, setAiTutorEnabled] = useState(
    sectionList[sectionId].aiTutorEnabled
  );

  const dispatch = useAppDispatch();

  const handleAITutorEnabledToggle = () => {
    const newValue = !aiTutorEnabled;
    handleUpdateSectionAITutorEnabled(sectionId, newValue);
    setAiTutorEnabled(newValue);
    dispatch(updateSectionAiTutorEnabled(sectionId, newValue));
  };

  useEffect(() => {
    setAiTutorEnabled(sectionList[sectionId].aiTutorEnabled);
  }, [sectionList, sectionId]);

  return (
    <div>
      <div className={style.toolTipContainer}>
        <ToggleSwitch
          id={'uitest-ai-tutor-toggle'}
          isToggledOn={aiTutorEnabled}
          onToggle={handleAITutorEnabledToggle}
          label={i18n.enableAITutor()}
        />
        <InfoHelpTip
          id={'ai-tutor-toggle-info'}
          content={i18n.enableAITutorTooltip()}
        />
      </div>
    </div>
  );
};

export default SectionAccessToggle;
