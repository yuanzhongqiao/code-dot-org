import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {Heading1, Heading6} from '@cdo/apps/componentLibrary/typography';
import DCDO from '@cdo/apps/dcdo';
import {EVENTS} from '@cdo/apps/lib/util/AnalyticsConstants';
import analyticsReporter from '@cdo/apps/lib/util/AnalyticsReporter';
import {tryGetLocalStorage, trySetLocalStorage} from '@cdo/apps/utils';
import i18n from '@cdo/locale';

import {unitDataPropType} from '../sectionProgress/sectionProgressConstants';
import {loadUnitProgress} from '../sectionProgress/sectionProgressLoader';
import {getCurrentUnitData} from '../sectionProgress/sectionProgressRedux';
import UnitSelectorV2 from '../UnitSelectorV2';

import IconKey from './IconKey';
import MoreOptionsDropdown from './MoreOptionsDropdown';
import ProgressTableV2 from './ProgressTableV2';

import styles from './progress-table-v2.module.scss';

const getLocalStorageString = (scriptId, sectionId) =>
  `expandedLessonProgressV2-${scriptId}-${sectionId}`;

const getLocalStorage = (scriptId, sectionId) => {
  try {
    return (
      JSON.parse(
        tryGetLocalStorage(getLocalStorageString(scriptId, sectionId), [])
      ) || []
    );
  } catch (e) {
    // If we fail to parse the local storage, default to nothing expanded.
    return [];
  }
};

function SectionProgressV2({
  scriptId,
  sectionId,
  unitData,
  isLoadingProgress,
  isRefreshingProgress,
  isLevelProgressLoaded,
}) {
  const [expandedLessonIds, setExpandedLessonIds] = React.useState(() =>
    getLocalStorage(scriptId, sectionId)
  );

  const expandedMetadataEnabled = React.useMemo(
    () => DCDO.get('progress-v2-metadata-enabled', false),
    []
  );

  React.useEffect(() => {
    setExpandedLessonIds(getLocalStorage(scriptId, sectionId));
    analyticsReporter.sendEvent(EVENTS.PROGRESS_V2_VIEW, {
      sectionId: sectionId,
      unitId: scriptId,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  }, [scriptId, sectionId]);

  const setExpandedLessons = React.useCallback(
    updateFunction => {
      const newUpdateFunction = currentExpandedLessonIds => {
        const newExpandedLessonIds = updateFunction(currentExpandedLessonIds);
        trySetLocalStorage(
          getLocalStorageString(scriptId, sectionId),
          JSON.stringify(newExpandedLessonIds)
        );
        return newExpandedLessonIds;
      };
      setExpandedLessonIds(newUpdateFunction);
    },
    [setExpandedLessonIds, scriptId, sectionId]
  );

  const levelDataInitialized = React.useMemo(() => {
    return unitData && isLevelProgressLoaded;
  }, [unitData, isLevelProgressLoaded]);

  React.useEffect(() => {
    if (!unitData && !isLoadingProgress && !isRefreshingProgress) {
      loadUnitProgress(scriptId, sectionId);
    }
  }, [unitData, isLoadingProgress, isRefreshingProgress, scriptId, sectionId]);

  const isViewingValidatedLevel = React.useMemo(() => {
    return unitData?.lessons
      .filter(lesson => expandedLessonIds.includes(lesson.id))
      .some(lesson => lesson.levels.some(level => level.isValidated));
  }, [expandedLessonIds, unitData]);

  return (
    <div className={styles.progressV2Page} data-testid="section-progress-v2">
      <Heading1>{i18n.progressBeta()}</Heading1>
      <IconKey
        isViewingValidatedLevel={isViewingValidatedLevel}
        expandedLessonIds={expandedLessonIds}
        sectionId={sectionId}
      />
      <div className={styles.title}>
        <Heading6 className={styles.titleStudents}>{i18n.students()}</Heading6>
        <Heading6 className={styles.titleUnitSelector}>
          {i18n.lessonsIn()}

          <UnitSelectorV2 className={styles.titleUnitSelectorDropdown} />
          {expandedMetadataEnabled && <MoreOptionsDropdown />}
        </Heading6>
      </div>
      <ProgressTableV2
        expandedLessonIds={expandedLessonIds}
        setExpandedLessons={setExpandedLessons}
        isSkeleton={!levelDataInitialized}
      />
    </div>
  );
}

SectionProgressV2.propTypes = {
  scriptId: PropTypes.number,
  sectionId: PropTypes.number,
  unitData: unitDataPropType,
  isLoadingProgress: PropTypes.bool.isRequired,
  isRefreshingProgress: PropTypes.bool.isRequired,
  isLevelProgressLoaded: PropTypes.bool.isRequired,
};

export default connect(state => ({
  scriptId: state.unitSelection.scriptId,
  sectionId: state.teacherSections.selectedSectionId,
  unitData: getCurrentUnitData(state),
  isLoadingProgress: state.sectionProgress.isLoadingProgress,
  isRefreshingProgress: state.sectionProgress.isRefreshingProgress,
  isLevelProgressLoaded:
    !!state.sectionProgress.studentLevelProgressByUnit[
      state.unitSelection.scriptId
    ],
}))(SectionProgressV2);
