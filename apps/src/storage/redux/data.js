/**
 * @file Redux reducer for data mode in App Lab.
 * @see http://redux.js.org/docs/basics/Reducers.html
 */

import {Record} from 'immutable';

import {DataView} from '../constants';

const UPDATE_TABLE_LIST = 'data/UPDATE_TABLE_LIST';
const ADD_TABLE_NAME = 'data/ADD_TABLE_NAME';
const CHANGE_VIEW = 'data/CHANGE_VIEW';
const DELETE_TABLE_NAME = 'data/DELETE_TABLE_NAME';
const UPDATE_TABLE_COLUMNS = 'data/UPDATE_TABLE_COLUMNS';
const UPDATE_TABLE_RECORDS = 'data/UPDATE_TABLE_RECORDS';
const UPDATE_KEY_VALUE_DATA = 'data/UPDATE_KEY_VALUE_DATA';
const SHOW_WARNING = 'data/SHOW_WARNING';
const CLEAR_WARNING = 'data/CLEAR_WARNING';
const SHOW_PREVIEW = 'data/SHOW_PREVIEW';
const HIDE_PREVIEW = 'data/HIDE_PREVIEW';
const SET_LIBRARY_MANIFEST = 'data/SET_LIBRARY_MANIFEST';

/**
 * Types which a column can be coerced to.
 * @enum {string}
 */
export const tableType = {
  SHARED: 'shared',
  PROJECT: 'project',
};

const DataState = Record({
  view: DataView.OVERVIEW,
  tableListMap: {},
  tableName: '',
  tableColumns: [],
  tableRecords: [],
  keyValueData: {},
  warningTitle: '',
  warningMsg: '',
  isWarningDialogOpen: false,
  isPreviewOpen: false,
  libraryManifest: {},
});

const initialState = new DataState();

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_TABLE_LIST:
      return state.set('tableListMap', action.tableListMap);
    case ADD_TABLE_NAME:
      return state.set(
        'tableListMap',
        Object.assign({}, state.tableListMap, {
          [action.tableName]: action.tableType,
        })
      );
    case CHANGE_VIEW:
      // Discard table data when not viewing a table, so that we don't momentarily
      // show data for the wrong table when we return to the table view.
      if (action.view !== DataView.TABLE) {
        state = state.set('tableRecords', []);
      }
      return state.set('view', action.view).set('tableName', action.tableName);
    case DELETE_TABLE_NAME: {
      let map = Object.assign({}, state.tableListMap);
      delete map[action.tableName];
      return state.set('tableListMap', map);
    }
    case UPDATE_KEY_VALUE_DATA:
      // "if all of the keys are integers, and more than half of the keys between 0 and
      // the maximum key in the object have non-empty values, then Firebase will render
      // it as an array."
      // https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
      // For simplicity, always coerce it to an object.
      return state.set('keyValueData', Object.assign({}, action.keyValueData));
    case UPDATE_TABLE_COLUMNS:
      if (state.tableName === action.tableName) {
        return state.set('tableColumns', action.tableColumns);
      }
      return state;
    case UPDATE_TABLE_RECORDS:
      if (state.tableName === action.tableName) {
        // "if all of the keys are integers, and more than half of the keys between 0 and
        // the maximum key in the object have non-empty values, then Firebase will render
        // it as an array."
        // https://firebase.googleblog.com/2014/04/best-practices-arrays-in-firebase.html
        // For simplicity, always coerce it to an array (list of records).
        if (!action.tableRecords) {
          return state.set('tableRecords', []);
        }
        let records = Array.isArray(action.tableRecords)
          ? action.tableRecords
          : Object.values(action.tableRecords);
        records = records.filter(record => record !== undefined);
        return state.set('tableRecords', records);
      }
      return state;
    case SHOW_WARNING:
      return state
        .set('warningMsg', action.warningMsg)
        .set('warningTitle', action.warningTitle)
        .set('isWarningDialogOpen', true);
    case CLEAR_WARNING:
      return state
        .set('warningMsg', '')
        .set('warningTitle', '')
        .set('isWarningDialogOpen', false);
    case SHOW_PREVIEW:
      return state
        .set('isPreviewOpen', true)
        .set('tableName', action.tableName);
    case HIDE_PREVIEW:
      return state
        .set('isPreviewOpen', false)
        .set('tableName', '')
        .set('tableRecords', [])
        .set('tableColumns', []);
    case SET_LIBRARY_MANIFEST:
      return state.set('libraryManifest', action.libraryManifest);
    default:
      return state;
  }
}

export const updateTableList = tableListMap => ({
  type: UPDATE_TABLE_LIST,
  tableListMap,
});

/**
 * Action which adds a table name to the table list map, if it doesn't exist already.
 * @param {string} tableName
 */
export const addTableName = (tableName, tableType) => ({
  type: ADD_TABLE_NAME,
  tableName,
  tableType,
});

export const changeView = (view, tableName) => ({
  type: CHANGE_VIEW,
  view,
  tableName,
});

/**
 * Action which deletes a table name from the table list map, if it exists in the map.
 * @param {string} tableName
 */

export const deleteTableName = tableName => ({
  type: DELETE_TABLE_NAME,
  tableName,
});

export const updateKeyValueData = keyValueData => ({
  type: UPDATE_KEY_VALUE_DATA,
  keyValueData,
});

export const updateTableColumns = (tableName, tableColumns) => ({
  type: UPDATE_TABLE_COLUMNS,
  tableName,
  tableColumns,
});

export const updateTableRecords = (tableName, tableRecords) => ({
  type: UPDATE_TABLE_RECORDS,
  tableName,
  tableRecords,
});

export const showWarning = (warningMsg, warningTitle) => ({
  type: SHOW_WARNING,
  warningMsg,
  warningTitle,
});

export const clearWarning = () => ({
  type: CLEAR_WARNING,
});

export const showPreview = tableName => ({type: SHOW_PREVIEW, tableName});

export const hidePreview = () => ({type: HIDE_PREVIEW});

export const setLibraryManifest = libraryManifest => ({
  type: SET_LIBRARY_MANIFEST,
  libraryManifest,
});
