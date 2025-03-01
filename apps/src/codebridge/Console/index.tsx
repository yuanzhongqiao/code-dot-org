import {resetOutput} from '@codebridge/redux/consoleRedux';
import React, {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';

import Button from '@cdo/apps/componentLibrary/button';
import PanelContainer from '@cdo/apps/lab2/views/components/PanelContainer';
import {useAppSelector} from '@cdo/apps/util/reduxHooks';

import moduleStyles from './console.module.scss';

const Console: React.FunctionComponent = () => {
  const codeOutput = useAppSelector(state => state.codebridgeConsole.output);
  const dispatch = useDispatch();
  const levelId = useAppSelector(state => state.lab.levelProperties?.id);
  const previousLevelId = useRef(levelId);
  const appName = useAppSelector(state => state.lab.levelProperties?.appName);

  // TODO: Update this with other apps that use the console as needed.
  const systemMessagePrefix = appName === 'pythonlab' ? '[PYTHON LAB] ' : '';

  useEffect(() => {
    // If the level changes, clear the console.
    if (previousLevelId.current !== levelId) {
      dispatch(resetOutput());
      previousLevelId.current = levelId;
    }
  }, [dispatch, levelId]);

  const clearOutput = () => {
    dispatch(resetOutput());
  };

  const headerButton = () => {
    return (
      <Button
        isIconOnly
        color={'black'}
        icon={{iconStyle: 'solid', iconName: 'eraser'}}
        ariaLabel="clear console"
        onClick={clearOutput}
        size={'xs'}
      />
    );
  };

  return (
    <PanelContainer
      id="codebridge-console"
      className={moduleStyles.consoleContainer}
      headerContent={'Console'}
      rightHeaderContent={headerButton()}
    >
      <div className={moduleStyles.console}>
        {codeOutput.map((outputLine, index) => {
          if (outputLine.type === 'img') {
            return (
              <img
                key={index}
                src={`data:image/png;base64,${outputLine.contents}`}
                alt="matplotlib_image"
              />
            );
          } else if (
            outputLine.type === 'system_out' ||
            outputLine.type === 'system_in'
          ) {
            return <div key={index}>{outputLine.contents}</div>;
          } else if (outputLine.type === 'error') {
            return (
              <div key={index} className={moduleStyles.errorLine}>
                {outputLine.contents}
              </div>
            );
          } else {
            return (
              <div key={index}>
                {systemMessagePrefix}
                {outputLine.contents}
              </div>
            );
          }
        })}
      </div>
    </PanelContainer>
  );
};

export default Console;
