import ACTION_TYPES from './MessageActionTypes';
import uuidv1 from 'uuid/v1';

/**
 * Adds a toast message to the admin interface
 *
 * @param {string} text Message text
 * @param {string} type Message type, one of 'success', 'notice', or 'error'
 * @returns {object}
 */
export const addMessage = (text, type = 'success') => {
  return {
    type: ACTION_TYPES.ADD_MESSAGE,
    payload: {
      id: uuidv1(), // give it a unique identifier for future reference
      text,
      type,
    },
  };
};

/**
 * Remove a toast message from the admin interface by its given ID. The ID is
 * generated in the addMessage() method above.
 *
 * @param {string} messageId
 * @returns {object}
 */
export const removeMessage = (messageId) => {
  // todo
  return {
    type: ACTION_TYPES.REMOVE_MESSAGE,
    payload: { messageId },
  };
};

/**
 * Clear all toast messages from the admin interface.
 *
 * NOTE: This will not work with the current jQuery.noticeAdd() implementation, but
 * is put in place for future use when messages are rendered via Redux and React
 * components.
 *
 * @returns {object}
 */
export const clearMessages = () => {
  return {
    type: ACTION_TYPES.CLEAR_MESSAGES,
  };
};
