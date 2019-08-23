import messageReducer from '../MessageReducer';
import ACTION_TYPES from '../MessageActionTypes';

describe('messageReducer', () => {
  const emptyState = [];
  const populatedState = [
    {
      id: '1234-5678',
      text: 'Something went wrong!',
      type: 'error',
    },
    {
      id: '2345-6789',
      text: 'Page published successfully.',
      type: 'success',
    },
  ];

  describe(ACTION_TYPES.ADD_MESSAGE, () => {
    it('should add a message to the state', () => {
      const nextState = messageReducer(emptyState, {
        type: ACTION_TYPES.ADD_MESSAGE,
        payload: {
          id: '123-456',
          text: 'Hello world',
        },
      });

      expect(nextState).toEqual([{
        id: '123-456',
        text: 'Hello world',
      }]);
    });
  });

  describe(ACTION_TYPES.REMOVE_MESSAGE, () => {
    it('should remove a specific message from the state', () => {
      const nextState = messageReducer(populatedState, {
        type: ACTION_TYPES.REMOVE_MESSAGE,
        payload: {
          id: '1234-5678',
        },
      });

      expect(nextState.length).toBe(1);
      expect(nextState).toEqual([
        {
          id: '2345-6789',
          text: 'Page published successfully.',
          type: 'success',
        }
      ]);
    });
  });

  describe(ACTION_TYPES.CLEAR_MESSAGES, () => {
    it('should clear all messages from the state', () => {
      const nextState = messageReducer(populatedState, {
        type: ACTION_TYPES.CLEAR_MESSAGES,
      });

      expect(nextState.length).toBe(0);
    });
  });
});
