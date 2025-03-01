import throttle from 'lodash/debounce';
import PropTypes from 'prop-types';
import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import PopUpMenu from '@cdo/apps/lib/ui/PopUpMenu';
import {studentShape} from '@cdo/apps/templates/teacherDashboard/teacherSectionsRedux';
import i18n from '@cdo/locale';

import FontAwesome from '../FontAwesome';
import {
  collapseMetadataForStudents,
  expandMetadataForStudents,
} from '../sectionProgress/sectionProgressRedux';

import style from './expand-all-rows-dropdown.module.scss';

const DROPDOWN_OFFSET = 172;

function MoreOptionsDropdown({
  students,
  expandMetadataForStudents,
  collapseMetadataForStudents,
}) {
  const [opened, setOpened] = useState(false);
  const [menuLocation, setMenuLocation] = useState({menuTop: 0, menuLeft: 0});
  const elementRef = useRef(null);
  const resizeListener = useRef(null);

  const getAllStudentIds = React.useMemo(
    () => students.map(student => student.id),
    [students]
  );

  const expandMetaDataForAllStudents = () => {
    expandMetadataForStudents(getAllStudentIds);
    setOpened(false);
  };

  const collapseMetaDataForAllStudents = () => {
    collapseMetadataForStudents(getAllStudentIds);
    setOpened(false);
  };

  const getMenuLocation = () => {
    const rect = elementRef.current.firstChild.getBoundingClientRect();
    return {
      menuTop: rect.bottom + window.pageYOffset,
      menuLeft: rect.right + window.pageXOffset - DROPDOWN_OFFSET,
    };
  };

  const updateMenuLocation = throttle(() => {
    setMenuLocation(getMenuLocation());
  }, 50);

  useEffect(() => {
    if (opened && !resizeListener.current) {
      resizeListener.current = updateMenuLocation;
      window.addEventListener('resize', resizeListener.current);
      setMenuLocation(getMenuLocation());
    } else if (!opened && resizeListener.current) {
      window.removeEventListener('resize', resizeListener.current);
      resizeListener.current = null;
    }

    return () => {
      if (resizeListener.current) {
        window.removeEventListener('resize', resizeListener.current);
      }
    };
  }, [updateMenuLocation, opened]);

  const handleDropdownClick = () => {
    setOpened(!opened);
  };

  const onClose = () => {
    setOpened(false);
  };

  const targetPoint = {top: menuLocation.menuTop, left: menuLocation.menuLeft};

  return (
    <div className={style.main} ref={elementRef}>
      <button
        type="button"
        className={style.expandButton}
        onClick={handleDropdownClick}
        aria-label={i18n.additionalOptions()}
      >
        <FontAwesome icon="ellipsis-vertical" />
      </button>
      {opened && (
        <PopUpMenu
          isOpen={opened}
          targetPoint={targetPoint}
          offset={{x: -elementRef.current.firstChild.offsetWidth, y: 5}}
          onClose={onClose}
          className={style.menu}
        >
          <PopUpMenu.Item
            className={style.menuItem}
            onClick={expandMetaDataForAllStudents}
            style={{marginTop: '4px', padding: '5px 14px'}}
          >
            <FontAwesome icon="arrows-from-line" />
            <div>{i18n.expandAll()}</div>
          </PopUpMenu.Item>
          <PopUpMenu.Item
            className={style.menuItem}
            onClick={collapseMetaDataForAllStudents}
            style={{marginBottom: '4px', padding: '5px 14px'}}
          >
            <FontAwesome icon="arrows-to-line" />
            <div>{i18n.collapseAll()}</div>
          </PopUpMenu.Item>
        </PopUpMenu>
      )}
    </div>
  );
}
MoreOptionsDropdown.propTypes = {
  students: PropTypes.arrayOf(studentShape),
  expandMetadataForStudents: PropTypes.func,
  collapseMetadataForStudents: PropTypes.func,
};

export const UnconnectedMoreOptionsDropdown = MoreOptionsDropdown;

export default connect(
  state => ({
    students: state.teacherSections.selectedStudents,
  }),
  dispatch => ({
    expandMetadataForStudents: studentIds =>
      dispatch(expandMetadataForStudents(studentIds)),
    collapseMetadataForStudents: studentIds =>
      dispatch(collapseMetadataForStudents(studentIds)),
  })
)(MoreOptionsDropdown);
