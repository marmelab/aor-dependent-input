import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';
import get from 'lodash.get';
import FormField from 'admin-on-rest/lib/mui/form/FormField';

const REDUX_FORM_NAME = 'record-form';

const getValue = (value, path) => {
    if (path.includes('.')) {
        return get(value, path);
    }

    if (typeof value === 'object') {
        return get(value, path);
    }

    return value;
};

const DependentInputComponent = ({ children, show, source, value, resolve, ...props }) =>
    show ? <FormField input={children} {...props} /> : null;

DependentInputComponent.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool.isRequired,
    source: PropTypes.any,
    value: PropTypes.any,
    resolve: PropTypes.func,
};

export const mapStateToProps = (state, { resolve, source, value }) => {
    if (resolve && (source === null || typeof source === 'undefined')) {
        const values = getFormValues(REDUX_FORM_NAME)(state);
        return { show: resolve(values) };
    }

    let formValue;
    // get the current form values from redux-form
    if (Array.isArray(source)) {
        // We have to destructure the array here as redux-form does not accept an array of fields
        formValue = formValueSelector(REDUX_FORM_NAME)(state, ...source);
    } else {
        formValue = formValueSelector(REDUX_FORM_NAME)(state, source);
    }

    if (resolve) {
        return { show: resolve(formValue, source) };
    }

    if (Array.isArray(source) && Array.isArray(value)) {
        return {
            show: source.reduce((acc, s, index) => acc && get(formValue, s) === value[index], true),
        };
    }

    if (typeof value === 'undefined') {
        if (Array.isArray(source)) {
            return {
                show: source.reduce((acc, s) => acc && !!getValue(formValue, s), true),
            };
        }

        return { show: !!formValue };
    }

    return { show: formValue === value };
};

export default connect(mapStateToProps)(DependentInputComponent);
