import PropTypes from 'prop-types';
import Radium from 'radium'; // eslint-disable-line no-restricted-imports
import React, {Component} from 'react';
import {connect} from 'react-redux';

import fontConstants from '@cdo/apps/fontConstants';

import styleConstants from '../styleConstants';
import color from '../util/color';

import FontAwesome from './FontAwesome';

import moduleStyles from './content-container.module.scss';

// ContentContainer provides a full-width container which will render whatever
// children are passed to it. The component is useful for creating clear,
// sub-sections on a page because it was built to reuse the styling and
// functionality of a heading and the option to show a link. You can find an
// example of its use on studio.code.org/home.

const contentWidth = styleConstants['content-width'];
const linkBoxLineHeight = '26 px';

class ContentContainer extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    heading: PropTypes.string,
    linkText: PropTypes.string,
    link: PropTypes.string,
    isRtl: PropTypes.bool.isRequired,
    description: PropTypes.string,
    responsiveSize: PropTypes.oneOf(['lg', 'md', 'sm', 'xs']).isRequired,
    hideBottomMargin: PropTypes.bool,
  };

  render() {
    const {
      heading,
      link,
      linkText,
      description,
      isRtl,
      responsiveSize,
      hideBottomMargin,
    } = this.props;

    const showLinkTop = responsiveSize === 'lg' && link && linkText;
    const showLinkBottom = responsiveSize !== 'lg' && link && linkText;
    const boxStyles = styles.boxResponsive;
    const bottomMargin = hideBottomMargin ? '' : styles.bottomMargin;

    return (
      <div style={[boxStyles, bottomMargin]}>
        {(heading || (link && linkText)) && (
          <div
            className={moduleStyles.contentContainerHeading}
            style={styles.headingBox}
          >
            <h4 style={isRtl ? styles.headingTextRtl : styles.headingText}>
              {heading}
            </h4>
            {showLinkTop && (
              <Link link={link} linkText={linkText} isRtl={isRtl} />
            )}
          </div>
        )}
        {description && <div style={styles.description}>{description}</div>}
        <div style={styles.children}>
          {React.Children.map(this.props.children, (child, index) => {
            return <div key={index}>{child}</div>;
          })}
        </div>
        {showLinkBottom && (
          <div style={styles.standaloneLinkBox}>
            <Link link={link} linkText={linkText} isRtl={isRtl} bottom={true} />
          </div>
        )}
        <div style={styles.clear} />
      </div>
    );
  }
}

class Link extends Component {
  static propTypes = {
    linkText: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    isRtl: PropTypes.bool.isRequired,
    bottom: PropTypes.bool,
  };

  render() {
    const {link, linkText, isRtl, bottom} = this.props;
    let linkBoxStyle;
    if (isRtl) {
      linkBoxStyle = bottom ? styles.linkBoxRtlBottom : styles.linkBoxRtl;
    } else {
      linkBoxStyle = bottom ? styles.linkBoxBottom : styles.linkBox;
    }
    const icon = isRtl ? 'chevron-left' : 'chevron-right';

    return (
      <div style={linkBoxStyle}>
        <a style={styles.linkTag} href={link}>
          <span style={{display: 'inline-block'}}>
            {isRtl && <FontAwesome icon={icon} style={styles.chevronRtl} />}
          </span>
          <div style={styles.linkToViewAll}>{linkText}</div>
          <span style={{display: 'inline-block'}}>
            {!isRtl && <FontAwesome icon={icon} style={styles.chevron} />}
          </span>
        </a>
      </div>
    );
  }
}

const styles = {
  box: {
    width: contentWidth,
  },
  boxResponsive: {
    width: '100%',
  },
  bottomMargin: {
    marginBottom: 60,
  },
  headingBox: {
    paddingRight: 10,
    paddingTop: 10,
    overflow: 'hidden',
    zIndex: 2,
    position: 'relative',
  },
  headingText: {
    fontSize: 24,
    lineHeight: '26px',
    color: color.neutral_dark,
    float: 'left',
    paddingRight: 20,
  },
  headingTextRtl: {
    fontSize: 24,
    lineHeight: '26px',
    color: color.neutral_dark,
    float: 'right',
    paddingLeft: 20,
  },
  standaloneLinkBox: {
    paddingTop: 10,
    position: 'relative',
    clear: 'both',
  },
  linkBox: {
    display: 'inline',
    position: 'absolute',
    bottom: 20,
    right: 0,
    lineHeight: linkBoxLineHeight,
  },
  linkBoxRtl: {
    display: 'inline',
    float: 'left',
    paddingLeft: 10,
    position: 'absolute',
    bottom: 20,
    left: 0,
    lineHeight: linkBoxLineHeight,
  },
  linkBoxBottom: {
    display: 'inline',
    left: 0,
  },
  linkBoxRtlBottom: {
    display: 'inline',
    right: 0,
  },
  description: {
    fontSize: 14,
    lineHeight: '22px',
    ...fontConstants['main-font-regular'],
    zIndex: 2,
    color: color.neutral_dark,
    width: '100%',
    marginTop: -10,
    marginBottom: 10,
    clear: 'both',
  },
  linkTag: {
    textDecoration: 'none',
  },
  linkToViewAll: {
    fontSize: 14,
    ...fontConstants['main-font-semi-bold'],
    marginTop: -2,
    display: 'inline',
  },
  chevron: {
    display: 'inline',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  chevronRtl: {
    display: 'inline',
    color: color.neutral_dark,
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 15,
  },
  children: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  clear: {
    clear: 'both',
  },
};

export default connect(state => ({
  responsiveSize: state.responsive.responsiveSize,
  isRtl: state.isRtl,
}))(Radium(ContentContainer));
