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

export const DependentInputComponent = ({ children, show, dependsOn, value, resolve, ...props }) => {
    if (!show) {
        return null;
    }

    if (Array.isArray(children)) {
        return (
            <span>
                {React.Children.map(children, child => <FormField input={child} {...props} />)}
            </span>
        );
    }

    return <FormField input={children} {...props} />;
};

DependentInputComponent.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool.isRequired,
    dependsOn: PropTypes.any,
    value: PropTypes.any,
    resolve: PropTypes.func,
};

export const mapStateToProps = (state, { resolve, dependsOn, value }) => {
    if (resolve && (dependsOn === null || typeof dependsOn === 'undefined')) {
        const values = getFormValues(REDUX_FORM_NAME)(state);
        return { show: resolve(values) };
    }

    let formValue;
    // get the current form values from redux-form
    if (Array.isArray(dependsOn)) {
        // We have to destructure the array here as redux-form does not accept an array of fields
        formValue = formValueSelector(REDUX_FORM_NAME)(state, ...dependsOn);
    } else {
        formValue = formValueSelector(REDUX_FORM_NAME)(state, dependsOn);
    }

    if (resolve) {
        return { show: resolve(formValue, dependsOn) };
    }

    if (Array.isArray(dependsOn) && Array.isArray(value)) {
        return {
            show: dependsOn.reduce((acc, s, index) => acc && get(formValue, s) === value[index], true),
        };
    }

    if (typeof value === 'undefined') {
        if (Array.isArray(dependsOn)) {
            return {
                show: dependsOn.reduce((acc, s) => acc && !!getValue(formValue, s), true),
            };
        }

        return { show: !!formValue };
    }

    return { show: formValue === value };
};

export default connect(mapStateToProps)(DependentInputComponent);
