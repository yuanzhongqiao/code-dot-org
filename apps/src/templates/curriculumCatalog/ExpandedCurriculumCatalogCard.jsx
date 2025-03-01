import React, {useEffect, useRef} from 'react';
import style from './expanded_curriculum_catalog_card.module.scss';
import centererStyle from './curriculum_catalog_card.module.scss';
import FontAwesome from '@cdo/apps/templates/FontAwesome';
import PropTypes from 'prop-types';
import {
  BodyTwoText,
  Heading3,
  Heading4,
} from '@cdo/apps/componentLibrary/typography';
import {TextLink} from '@dsco_/link';
import Button from '@cdo/apps/templates/Button';
import i18n from '@cdo/locale';
import {
  translatedCourseOfferingDeviceTypes,
  translatedAvailableResources,
} from '../teacherDashboard/CourseOfferingHelpers';
import {defaultImageSrc} from './curriculumCatalogConstants';
import analyticsReporter from '@cdo/apps/lib/util/AnalyticsReporter';
import {EVENTS} from '@cdo/apps/lib/util/AnalyticsConstants';

const ExpandedCurriculumCatalogCard = ({
  courseKey,
  courseDisplayName,
  duration,
  gradeRange,
  subjectsAndTopics,
  deviceCompatibility,
  description,
  professionalLearningProgram,
  video,
  publishedDate,
  selfPacedPlCourseOfferingPath,
  pathToCourse,
  assignButtonOnClick,
  assignButtonDescription,
  onClose,
  handleSetExpandedCardKey,
  isInUS,
  imageSrc,
  imageAltText,
  availableResources,
  isSignedOut,
  isTeacher,
  recommendedSimilarCurriculum,
  recommendedStretchCurriculum,
}) => {
  const isTeacherOrSignedOut = isSignedOut || isTeacher;
  const expandedCardRef = useRef(null);
  const iconData = {
    ideal: {
      icon: 'circle-check',
      color: style.circleCheck,
    },
    not_recommended: {
      icon: 'triangle-exclamation',
      color: style.triangleExclamation,
    },
    incompatible: {
      icon: 'circle-xmark',
      color: style.circleXmark,
    },
  };

  const devices = deviceCompatibility ? JSON.parse(deviceCompatibility) : {};

  const resoucesOrder = [
    'Lesson Plan',
    'Slide Deck',
    'Activity Guide',
    'Answer Key',
    'Rubric',
  ];

  const availableResourcesCount = availableResources
    ? Object.keys(availableResources).length
    : 0;

  let availableResourceCounter = 0;

  const displayDivider = () => {
    return ++availableResourceCounter < availableResourcesCount;
  };

  const handleClickRecommendedSimilarCurriculum = () => {
    analyticsReporter.sendEvent(EVENTS.RECOMMENDED_SIMILAR_CURRICULUM_CLICKED, {
      current_curriculum_offering: courseKey,
      recommended_similar_curriculum_offering: recommendedSimilarCurriculum.key,
    });
    handleSetExpandedCardKey(recommendedSimilarCurriculum.key);
  };

  const handleClickRecommendedStretchCurriculum = () => {
    analyticsReporter.sendEvent(EVENTS.RECOMMENDED_STRETCH_CURRICULUM_CLICKED, {
      current_curriculum_offering: courseKey,
      recommended_stretch_curriculum_offering: recommendedStretchCurriculum.key,
    });
    handleSetExpandedCardKey(recommendedStretchCurriculum.key);
  };

  useEffect(() => {
    const yOffset =
      expandedCardRef.current.getBoundingClientRect().top +
      window.scrollY -
      150;
    window.scrollTo({top: yOffset, behavior: 'smooth'});
  }, [expandedCardRef]);

  const quickViewButtonColor = !isTeacherOrSignedOut
    ? Button.ButtonColor.brandSecondaryDefault
    : Button.ButtonColor.neutralDark;

  return (
    <div ref={expandedCardRef}>
      <div
        className={`${style.arrowContainer} ${centererStyle.arrowContainer}`}
      />
      <div className={centererStyle.centerExpandedCard}>
        <div className={style.expandedCardContainer}>
          <div className={style.flexDivider}>
            <div className={style.courseOfferingContainer}>
              <Heading3>{courseDisplayName}</Heading3>
              <div className={style.infoContainer}>
                <div className={style.iconWithDescription}>
                  <FontAwesome icon="user" className="fa-solid" />
                  <BodyTwoText>{gradeRange}</BodyTwoText>
                </div>
                <div className={style.iconWithDescription}>
                  <FontAwesome icon="clock" className="fa-solid" />
                  <BodyTwoText>{duration}</BodyTwoText>
                </div>
                <div className={style.iconWithDescription}>
                  <FontAwesome icon="book" className="fa-solid" />
                  <BodyTwoText className={style.subjectsText}>
                    {i18n.topic() + ': ' + subjectsAndTopics.join(', ')}
                  </BodyTwoText>
                </div>
              </div>
              <hr className={style.horizontalDivider} />
              <div className={style.centerContentContainer}>
                <div className={style.descriptionVideoContainer}>
                  <div className={style.descriptionContainer}>
                    <BodyTwoText>{description}</BodyTwoText>
                  </div>
                  <div className={style.mediaContainer}>
                    {video ? (
                      <div className={style.videoContainer}>
                        <iframe
                          width="100%"
                          height="100%"
                          style={{border: 'none'}}
                          src={video}
                          title="Youtube embed"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className={style.imageContainer}>
                        <img
                          src={imageSrc}
                          alt={imageAltText}
                          style={{height: '100%'}}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className={style.linksContainer}>
                  <div className={style.resourcesContainer}>
                    {availableResourcesCount > 0 && (
                      <div>
                        <Heading4 visualAppearance="heading-xs">
                          {i18n.availableResources()}
                        </Heading4>
                        <hr className={style.thickDivider} />
                        {resoucesOrder.map(
                          resource =>
                            availableResources[resource] && (
                              <div key={resource}>
                                <BodyTwoText>
                                  {translatedAvailableResources[resource]}{' '}
                                </BodyTwoText>
                                {displayDivider() && (
                                  <hr className={style.horizontalDivider} />
                                )}
                              </div>
                            )
                        )}
                      </div>
                    )}
                  </div>
                  {isInUS &&
                    (isSignedOut || isTeacher) &&
                    (professionalLearningProgram ||
                      selfPacedPlCourseOfferingPath) && (
                      <div className={style.professionalLearningContainer}>
                        <Heading4 visualAppearance="heading-xs">
                          {i18n.professionalLearning()}
                        </Heading4>
                        <hr className={style.thickDivider} />
                        {professionalLearningProgram && (
                          <TextLink
                            text={i18n.facilitatorLedWorkshops()}
                            href={professionalLearningProgram}
                            icon={
                              <FontAwesome
                                icon="arrow-up-right-from-square"
                                className="fa-solid"
                              />
                            }
                          />
                        )}
                        {professionalLearningProgram &&
                          selfPacedPlCourseOfferingPath && (
                            <hr className={style.horizontalDivider} />
                          )}
                        {selfPacedPlCourseOfferingPath && (
                          <TextLink
                            text={i18n.selfPacedPl()}
                            href={selfPacedPlCourseOfferingPath}
                            icon={
                              <FontAwesome
                                icon="arrow-up-right-from-square"
                                className="fa-solid"
                              />
                            }
                          />
                        )}
                      </div>
                    )}
                </div>
              </div>
              <hr className={style.horizontalDivider} />
              <div className={style.compatibilityContainer}>
                {Object.keys(devices).map(
                  device =>
                    devices[device] !== '' && (
                      <div key={device} className={style.iconWithDescription}>
                        <FontAwesome
                          icon={iconData[devices[device]].icon}
                          className={`fa-solid ${
                            iconData[devices[device]].color
                          }`}
                        />
                        <BodyTwoText>
                          {device !== 'no_device'
                            ? translatedCourseOfferingDeviceTypes[device]
                                .charAt(0)
                                .toUpperCase() +
                              translatedCourseOfferingDeviceTypes[device].slice(
                                1
                              )
                            : i18n.offline()}
                        </BodyTwoText>
                      </div>
                    )
                )}
              </div>
              <hr className={style.horizontalDivider} />
              <div className={style.buttonsContainer}>
                <Button
                  __useDeprecatedTag
                  color={quickViewButtonColor}
                  type="button"
                  href={pathToCourse}
                  aria-label={
                    isTeacherOrSignedOut
                      ? i18n.quickViewDescription({
                          course_name: courseDisplayName,
                        })
                      : i18n.tryCourseNow({
                          course_name: courseDisplayName,
                        })
                  }
                  text={
                    isTeacherOrSignedOut
                      ? i18n.seeCurriculumDetails()
                      : i18n.tryNow()
                  }
                  className={centererStyle.buttonFlex}
                />
                {isTeacherOrSignedOut && (
                  <Button
                    color={Button.ButtonColor.brandSecondaryDefault}
                    type="button"
                    onClick={() => assignButtonOnClick('expanded-card')}
                    aria-label={assignButtonDescription}
                    text={i18n.assignToClassSections()}
                    className={centererStyle.buttonFlex}
                  />
                )}
              </div>
            </div>
            <div className={style.relatedCurriculaContainer}>
              <div className={style.closeButton}>
                <Button
                  onClick={onClose}
                  icon="xmark"
                  iconClassName="fa-solid"
                  aria-label="Close Button"
                />
              </div>
              <div className={style.relatedContainer}>
                <Heading4 visualAppearance="heading-xs">
                  {i18n.relatedCurricula()}
                </Heading4>
                <hr className={style.thickDivider} />
                <img
                  id="similarCurriculumImage"
                  src={recommendedSimilarCurriculum.image || defaultImageSrc}
                  alt={recommendedSimilarCurriculum.display_name}
                />
                <Button
                  id="similarCurriculumButton"
                  name={recommendedSimilarCurriculum.display_name}
                  type="button"
                  styleAsText
                  className={style.relatedCurriculaLink}
                  text={recommendedSimilarCurriculum.display_name}
                  onClick={handleClickRecommendedSimilarCurriculum}
                />
                <img
                  id="stretchCurriculumImage"
                  src={recommendedStretchCurriculum.image || defaultImageSrc}
                  alt={recommendedStretchCurriculum.display_name}
                />
                <Button
                  id="stretchCurriculumButton"
                  name={recommendedStretchCurriculum.display_name}
                  type="button"
                  styleAsText
                  className={style.relatedCurriculaLink}
                  text={recommendedStretchCurriculum.display_name}
                  onClick={handleClickRecommendedStretchCurriculum}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
ExpandedCurriculumCatalogCard.propTypes = {
  courseKey: PropTypes.string.isRequired,
  courseDisplayName: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  gradeRange: PropTypes.string.isRequired,
  subjectsAndTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
  deviceCompatibility: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  professionalLearningProgram: PropTypes.string,
  video: PropTypes.string,
  publishedDate: PropTypes.string.isRequired,
  selfPacedPlCourseOfferingPath: PropTypes.string,
  pathToCourse: PropTypes.string,
  assignButtonOnClick: PropTypes.func,
  assignButtonDescription: PropTypes.string,
  onClose: PropTypes.func,
  handleSetExpandedCardKey: PropTypes.func.isRequired,
  isInUS: PropTypes.bool,
  imageSrc: PropTypes.string,
  imageAltText: PropTypes.string,
  availableResources: PropTypes.object,
  isTeacher: PropTypes.bool.isRequired,
  isSignedOut: PropTypes.bool.isRequired,
  recommendedSimilarCurriculum: PropTypes.object,
  recommendedStretchCurriculum: PropTypes.object,
};
export default ExpandedCurriculumCatalogCard;
