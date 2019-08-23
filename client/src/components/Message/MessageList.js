import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * A list of messages to be displayed in the admin interface.
 */
class MessageList extends Component {
  /**
   * Detect when messages change in the component's props, and render the new ones.
   * This is only used for jQuery noticeAdd(), since we don't actually render that
   * DOM via this component yet.
   *
   * @param {object} prevProps
   */
  componentDidUpdate(prevProps) {
    const { messages } = this.props;

    if (messages === prevProps.messages) {
      // Messages have not changed
      return;
    }

    messages.forEach(message => {
      if (prevProps.messages.includes(message)) {
        // Message has already been processed
        return;
      }
      this.addLegacyNotice(message.text, message.type);
    });
  }

  /**
   * Uses the window jQuery noticeAdd() plugin to push toast messages into the CMS.
   *
   * WARNING: Do not use this API! It will likely be removed in future, in favour
   * of native React driven toast messages via this component.
   *
   * @param {string} text
   * @param {string} type 'success', 'notice', or 'error'
   */
  addLegacyNotice(text, type = 'success') {
    window.jQuery.noticeAdd({
      text,
      type,
      stayTime: 5000,
      inEffect: { left: '0', opacity: 'show' },
    });
  }

  render() {
    // Component currently works by causing window side effects with jQuery.
    // In future it will render Message components for each message here instead.
    return null;
  }
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      type: PropTypes.oneOf(['success', 'notice', 'error']),
    })
  ),
};

MessageList.defaultProps = {
  messages: [],
};

function mapStateToProps(state) {
  return {
    messages: state.messages,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
