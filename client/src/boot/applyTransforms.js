import Injector from 'lib/Injector';
import Validator from 'lib/Validator';
import classnames from 'classnames';
import { findField } from 'lib/schemaFieldValues';
import fieldHolder from 'components/FieldHolder/FieldHolder';

const togglePristineState = (field, isPristine = false) => {
  // set pristine and dirty classes if they're defined
  const classes = (field.extraClass)
    ? field.extraClass.split(' ').reduce((prev, className) => ({
      ...prev,
      [className]: true,
    }), {})
    : {};
  if (typeof field.data.pristineClass === 'string') {
    classes[field.data.pristineClass] = isPristine;
  }
  if (typeof field.data.dirtyClass === 'string') {
    classes[field.data.dirtyClass] = !isPristine;
  }

  // custom titles and icons to replace the default
  const customTitle = isPristine ? field.data.pristineTitle : field.data.dirtyTitle;
  const customIcon = isPristine ? field.data.pristineIcon : field.data.dirtyIcon;

  return {
    ...field,
    title: customTitle || field.title,
    icon: customIcon || field.icon,
    extraClass: classnames(classes),
  };
};

const applyTransforms = () => {
  Injector.transform(
    'field-holders',
    (updater) => {
      const fields = [
        'FieldGroup',
      ];
      fields.forEach((field) => updater.component('FieldGroup', fieldHolder, `${field}Holder`));
    }
  );
  Injector.transform(
    'form-action-changed',
    (updater) => {
      updater.form.alterSchema('*', (form) => {
        form.mutateField('action_save', (field) => {
          const isPristine = form.isPristine();

          return togglePristineState(field, isPristine);
        });
        form.mutateField('action_publish', (field) => {
          const isPristine = field.data.isPublished && !field.data.isModified && form.isPristine();

          return togglePristineState(field, isPristine);
        });

        return form.getState();
      });
    });
  Injector.transform(
    'schema-validation',
    (updater) => {
      updater.form.addValidation(
        '*',
        (values, Validation, schema) => {
          // Hardcoded exclusion for elemental inline forms
          // This is done so that client-side validation doesn't run so that all validation is done
          // on the server. This is done so that invalid, closed elements will popup open and
          // also trigger a toast notification.
          // Note that this has no effect on non-inline forms as they do not use form schema
          if (schema.name.indexOf('ElementForm_') === 0) {
            return Validation.getState();
          }
          const validator = new Validator(values);
          const errorMap = Object.keys(values).reduce((curr, key) => {
            const field = findField(schema.fields, key);
            if (!field) {
              return curr;
            }
            const { valid, errors } = validator.validateFieldSchema(field);
            if (valid) {
              return curr;
            }
            return {
              ...curr,
              [key]: errors
            };
          }, {});
          Validation.addErrors(errorMap);

          return Validation.getState();
        }
      );
    });
};

export default applyTransforms;
