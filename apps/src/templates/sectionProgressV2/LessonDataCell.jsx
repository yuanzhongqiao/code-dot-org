import {Link} from '@dsco_/link';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {lessonHasLevels} from '../progress/progressHelpers';
import {studentLessonProgressType} from '../progress/progressTypes';
import {teacherDashboardUrl} from '../teacherDashboard/urlHelpers';

import {ITEM_TYPE} from './ItemType';
import {formatTimeSpent, formatLastUpdated} from './MetadataHelpers';
import ProgressIcon from './ProgressIcon';

import styles from './progress-table-v2.module.scss';

function LessonDataCell({
  lesson,
  sectionId,
  locked,
  studentLessonProgress,
  addExpandedLesson,
  studentId,
  metadataExpanded,
}) {
  const noLevels = !lessonHasLevels(lesson);
  const finished = studentLessonProgress?.completedPercent === 100;
  const partiallyComplete = studentLessonProgress && !finished;

  const interactive = !noLevels;

  const getCellComponent = children => {
    if (lesson.lockable && interactive) {
      return (
        <Link
          className={classNames(
            styles.gridBox,
            styles.gridBoxLesson,
            locked && styles.littleLock
          )}
          href={teacherDashboardUrl(sectionId, '/assessments')}
          openInNewTab
          external
          data-testid={'lesson-data-cell-' + lesson.id + '-' + studentId}
        >
          {children}
        </Link>
      );
    }

    return (
      <div
        className={classNames(
          styles.gridBox,
          styles.gridBoxLesson,
          locked && styles.littleLock,
          interactive && styles.lessonInteractive
        )}
        onClick={expandLesson}
        data-testid={'lesson-data-cell-' + lesson.id + '-' + studentId}
      >
        {children}
      </div>
    );
  };

  const expandLesson = interactive
    ? () => addExpandedLesson(lesson)
    : undefined;

  const lessonCellUnexpanded = getCellComponent(
    <>
      {finished && <ProgressIcon itemType={ITEM_TYPE.SUBMITTED} />}
      {partiallyComplete && <ProgressIcon itemType={ITEM_TYPE.IN_PROGRESS} />}
      {noLevels && <ProgressIcon itemType={ITEM_TYPE.NO_ONLINE_WORK} />}
    </>
  );

  if (metadataExpanded) {
    return (
      <div className={styles.lessonDataCellExpanded}>
        {lessonCellUnexpanded}
        <div className={classNames(styles.gridBox, styles.gridBoxMetadata)}>
          {formatTimeSpent(studentLessonProgress)}
        </div>
        <div className={classNames(styles.gridBox, styles.gridBoxMetadata)}>
          {formatLastUpdated(studentLessonProgress)}
        </div>
      </div>
    );
  }

  return lessonCellUnexpanded;
}

export const UnconnectedLessonDataCell = LessonDataCell;

export default connect(state => ({
  sectionId: state.teacherSections.selectedSectionId,
}))(LessonDataCell);

LessonDataCell.propTypes = {
  locked: PropTypes.bool,
  sectionId: PropTypes.number,
  studentLessonProgress: studentLessonProgressType,
  lesson: PropTypes.object.isRequired,
  addExpandedLesson: PropTypes.func.isRequired,
  studentId: PropTypes.number.isRequired,
  metadataExpanded: PropTypes.bool,
};
