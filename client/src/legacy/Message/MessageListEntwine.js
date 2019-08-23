import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadComponent } from 'lib/Injector';

/**
 * Uses entwine to inject the HistoryViewer React component into the DOM, when used
 * outside of a React context e.g. in the CMS
 */
jQuery.entwine('ss', ($) => {
  $('.js-injector-boot .cms-messages__container').entwine({
    onmatch() {
      const cmsContent = this.closest('.cms').find('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      const MessageListComponent = loadComponent('MessageList', context);

      const props = {
        // todo
      };

      ReactDOM.render(
        <MessageListComponent {...props} />,
        this[0]
      );
    },

    onunmatch() {
      ReactDOM.unmountComponentAtNode(this[0]);
    }
  });
});
