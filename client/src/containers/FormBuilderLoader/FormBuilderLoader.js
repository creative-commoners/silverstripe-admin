import i18n from 'i18n';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import fetch from 'isomorphic-fetch';
import deepFreeze from 'deep-freeze-strict';
import {
  SubmissionError,
  autofill,
  initialize
} from 'redux-form';
import schemaFieldValues from 'lib/schemaFieldValues';
import { createErrorHtml } from 'lib/createErrorBlock';
import * as schemaActions from 'state/schema/SchemaActions';
import merge from 'merge';
import FormBuilder, { basePropTypes, schemaPropType } from 'components/FormBuilder/FormBuilder';
import getIn from 'redux-form/lib/structure/plain/getIn';
import { inject } from 'lib/Injector';
import getFormState from 'lib/getFormState';

/**
 * Creates a dot-separated identifier for forms generated
 * with schemas (e.g. FormBuilderLoader)
 *
 * @param {string} identifier
 * @param {object} schema
 * @returns {string}
 */
function createFormIdentifierFromProps({ identifier, schema = {} }) {
  return [
    identifier,
    schema.schema && schema.schema.name,
  ].filter(id => id).join('.');
}

const FormBuilderLoader = (props) => {
  const [didError, setDidError] = useState(false);

  /**
   * Checks for any state override data provided, which will take precendence over the state
   * received through fetch.
   *
   * This is important for editing a WYSIWYG item which needs the form schema and only parts of
   * the form state.
   *
   * @param {object} state
   * @returns {object}
   */
  const overrideStateData = (state) => {
    if (!props.stateOverrides || !state) {
      return state;
    }
    const fieldOverrides = props.stateOverrides.fields;
    let fields = state.fields;
    if (fieldOverrides && fields) {
      fields = fields.map((field) => {
        const fieldOverride = fieldOverrides.find((override) => override.name === field.name);
        // need to be recursive for the unknown-sized "data" properly
        return (fieldOverride) ? merge.recursive(true, field, fieldOverride) : field;
      });
    }

    return Object.assign({},
      state,
      props.stateOverrides,
      { fields }
    );
  };

  /**
   * Convert error to a json object to pass to onLoadingError
   *
   * @param {Object} error
   */
  const normaliseError = (error) => {
    // JSON result contains errors.
    // See LeftAndMain::jsonError() for format
    if (error.json && error.json.errors) {
      return error.json;
    }
    // Standard http errors
    if (error.status && error.statusText) {
      return {
        errors: [
          {
            code: error.status,
            value: error.statusText,
            type: 'error',
          },
        ],
      };
    }
    // Handle exception
    const message = error.message
      || i18n._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred.');
    return {
      errors: [
        {
          value: message,
          type: 'error',
        },
      ],
    };
  };

  /**
   * Call to make the fetching happen
   *
   * @param headerValues
   * @returns {*}
   */
  const callFetch = (headerValues) => fetch(props.schemaUrl, {
    headers: {
      'X-FormSchema-Request': headerValues.join(','),
      Accept: 'application/json',
    },
    credentials: 'same-origin',
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      return new Promise(
        (resolve, reject) => response
          .json()
          .then((json) => {
            reject({
              status: response.status,
              statusText: response.statusText,
              json,
            });
          })
          .catch(() => {
            reject({
              status: response.status,
              statusText: response.statusText,
              json: {},
            });
          })
      );
    });

  /**
   * Fetches data used to generate a form. This can be form schema and/or form state data.
   * When the response comes back the data is saved to state.
   *
   * @param {Boolean} schema If form schema data should be returned in the response.
   * @param {Boolean} state If form state data should be returned in the response.
   * @param {Boolean} errors If form errors should be returned in the response.
   * @return {Object} Promise from the AJAX request.
   */
  const doFetch = (schema = true, state = true, errors = true) => {
    if (props.loading) {
      return Promise.resolve({});
    }

    // Note: `errors` is only valid for submissions, not schema requests, so omitted here
    const headerValues = [
      'auto',
      schema && 'schema',
      state && 'state',
      errors && 'errors',
    ].filter(header => header);

    // using `state.fetching` caused race-condition issues.
    props.actions.schema.setSchemaLoading(props.schemaUrl, true);

    if (typeof props.onFetchingSchema === 'function') {
      props.onFetchingSchema();
    }

    return callFetch(headerValues)
      .then(formSchema => {
        props.actions.schema.setSchemaLoading(props.schemaUrl, false);

        if (formSchema.errors) {
          if (typeof props.onLoadingError === 'function') {
            props.onLoadingError(formSchema);
          }
        } else if (typeof props.onLoadingSuccess === 'function') {
          props.onLoadingSuccess();
        }

        if (typeof formSchema.id !== 'undefined' && formSchema.state) {
          const overriddenSchema = Object.assign({},
            formSchema,
            {
              state: overrideStateData(formSchema.state),
            }
          );

          // Mock the will-be shape of the props so that the identifier is right
          const identifier = createFormIdentifierFromProps({
            ...props,
            schema: {
              ...props.schema,
              ...overriddenSchema,
            },
          });

          props.actions.schema.setSchema(
            props.schemaUrl,
            overriddenSchema,
            identifier
          );

          const schemaData = formSchema.schema || props.schema.schema;
          const formData = schemaFieldValues(schemaData, overriddenSchema.state);

          // need to initialize the form again in case it was loaded before
          // this will re-trigger Injector.form APIs, reset values and reset pristine state as well
          props.actions.reduxForm.initialize(
            identifier,
            formData,
            false,
            { keepSubmitSucceeded: true }
          );

          if (typeof props.onReduxFormInit === 'function') {
            props.onReduxFormInit();
          }

          return overriddenSchema;
        }
        return formSchema;
      })
      .catch((error) => {
        setDidError(true);
        props.actions.schema.setSchemaLoading(props.schemaUrl, false);
        if (typeof props.onLoadingError === 'function') {
          return props.onLoadingError(normaliseError(error));
        }
        // Assign onLoadingError to suppress this
        throw error;
      });
  };

  let justFetched = false;

  useEffect(() => {
    if (props.refetchSchemaOnMount || !props.schema) {
      doFetch();
      justFetched = true;
    }
  }, []);

  useEffect(() => {
    if (!justFetched) {
      doFetch();
    }
  }, [props.scheumaUrl, justFetched]);

  /**
   * Get server-side validation messages returned and display them on the form.
   *
   * @param state
   * @returns {object}
   */
  const getMessages = (state) => {
    const messages = {};
    // only error messages are collected
    if (state && state.fields) {
      state.fields.forEach((field) => {
        if (field.message) {
          messages[field.name] = field.message;
        }
      });
    }
    return messages;
  };

  const getIdentifier = (propArgs = props) => createFormIdentifierFromProps(propArgs);

  /**
   * Given a submitted schema, ensure that any errors property is merged safely into
   * the state.
   *
   * @param {Object} schema - New schema result
   * @return {Object}
   */
  const reduceSchemaErrors = (schema) => {
    // Skip if there are no errors
    if (!schema.errors) {
      return schema;
    }

    // Inherit state from current schema if not being assigned in this request
    let reduced = { ...schema };
    if (!reduced.state) {
      reduced = {
        ...reduced,
        state: props.schema.state
      };
    }

    // Modify state.fields and replace state.messages
    reduced = {
      ...reduced,
      state: {
        ...reduced.state,
        // Replace message property for each field
        fields: reduced.state.fields.map((field) => {
          let message = schema.errors.find((error) => error.field === field.name);
          if (message) {
            message = createErrorHtml([message.value]);
          }
          return {
            ...field,
            message,
          };
        }),
        // Non-field messages
        messages: schema.errors.filter((error) => !error.field),
      },
    };

    // Can be safely discarded
    delete reduced.errors;
    return deepFreeze(reduced);
  };

  /**
   * Handles updating the schema after response is received and gathering server-side validation
   * messages.
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @returns {Promise}
   */
  const handleSubmit = (data, action, submitFn) => {
    let promise = null;

    // need to initialise form data and setSchema before any redirects by callbacks happen
    const newSubmitFn = () => (
      submitFn()
        .then(formSchema => {
          let schema = formSchema;

          if (schema) {
            // Before modifying schema, check if the schema state is provided explicitly
            const explicitUpdatedState = typeof schema.state !== 'undefined';

            // Merge any errors into the current state to update messages and alerts
            schema = reduceSchemaErrors(schema);
            props.actions.schema.setSchema(
              props.schemaUrl,
              schema,
              getIdentifier()
            );

            // If state is updated in server response, re-initialize redux form state
            if (explicitUpdatedState) {
              const schemaRef = schema.schema || props.schema.schema;
              const formData = schemaFieldValues(schemaRef, schema.state);
              props.actions.reduxForm.initialize(getIdentifier(), formData);
            }
          }
          return schema;
        })
    );

    if (typeof props.onSubmit === 'function') {
      promise = props.onSubmit(data, action, newSubmitFn);
    } else {
      promise = newSubmitFn();
    }

    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }

    return promise
      .then(formSchema => {
        if (!formSchema || !formSchema.state) {
          return formSchema;
        }
        const messages = getMessages(formSchema.state);

        if (Object.keys(messages).length) {
          throw new SubmissionError(messages);
        }
        return formSchema;
      });
  };

  /**
   * Sets the value of a field based on actions within other fields, this is a more semantic way to
   * change a field's value than calling onChange() for the target field.
   *
   * By virtue of redux-form, it also flags the field as "meta.autofilled"
   *
   * @param field
   * @param value
   */
  const handleAutofill = (field, value) => {
    props.actions.reduxForm.autofill(getIdentifier(), field, value);
  };

  if (didError) {
    return null;
  }
  // If the response from fetching the initial data
  // hasn't come back yet, don't render anything.
  if (!props.schema || !props.schema.schema || props.loading) {
    const Loading = props.loadingComponent;
    return <Loading containerClass="loading--form flexbox-area-grow" />;
  }

  const newProps = Object.assign({}, props, {
    form: getIdentifier(),
    onSubmitSuccess: props.onSubmitSuccess,
    onSubmit: handleSubmit,
    onAutofill: handleAutofill,
    autoFocus: props.autoFocus,
  });

  return <FormBuilder {...newProps} />;
};

FormBuilderLoader.propTypes = Object.assign({}, basePropTypes, {
  actions: PropTypes.shape({
    schema: PropTypes.object,
    reduxFrom: PropTypes.object,
  }),
  autoFocus: PropTypes.bool,
  identifier: PropTypes.string.isRequired,
  schemaUrl: PropTypes.string.isRequired,
  schema: schemaPropType,
  refetchSchemaOnMount: PropTypes.bool.isRequired,
  form: PropTypes.string,
  submitting: PropTypes.bool,
  onFetchingSchema: PropTypes.func,
  onReduxFormInit: PropTypes.func,
  loadingComponent: PropTypes.elementType.isRequired,
});

FormBuilderLoader.defaultProps = {
  refetchSchemaOnMount: true,
};

function mapStateToProps(state, ownProps) {
  const schema = state.form.formSchemas[ownProps.schemaUrl];
  const identifier = createFormIdentifierFromProps({ ...ownProps, schema });
  const reduxFormState = getIn(getFormState(state), identifier);

  const submitting = reduxFormState && reduxFormState.submitting;
  const values = reduxFormState && reduxFormState.values;

  const stateOverrides = schema && schema.stateOverride;
  const loading = schema && schema.metadata && schema.metadata.loading;
  return { schema, submitting, values, stateOverrides, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
      reduxForm: bindActionCreators({ autofill, initialize }, dispatch),
    },
  };
}

export { FormBuilderLoader as Component, createFormIdentifierFromProps };

export default compose(
  inject(
    ['ReduxForm', 'ReduxFormField', 'Loading'],
    (ReduxForm, ReduxFormField, Loading) => ({
      loadingComponent: Loading,
      baseFormComponent: ReduxForm,
      baseFieldComponent: ReduxFormField,
    }),
    ({ identifier }) => identifier
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormBuilderLoader);
