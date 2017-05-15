import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';
import get from 'lodash.get';
import { Labeled } from 'admin-on-rest';

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

export const mapStateToPropsFactory = (source, value) => state => {
    // source is a validator function, call it with the current form values
    if (typeof source === 'function') {
        const values = getFormValues(REDUX_FORM_NAME)(state);

        return { show: source(values) };
    }

    let formValue;
    // get the current form values from redux-form
    if (Array.isArray(source)) {
        // We have to destructure the array here as redux-form does not accept an array of fields
        formValue = formValueSelector(REDUX_FORM_NAME)(state, ...source);
    } else {
        formValue = formValueSelector(REDUX_FORM_NAME)(state, source);
    }

    if (Array.isArray(source) && Array.isArray(value)) {
        return {
            show: source.reduce((acc, s, index) => acc && get(formValue, s) === value[index], true),
        };
    }

    if (typeof value === 'function') {
        return { show: value(formValue, source) };
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

export default (source, value) => Component => {
    // Mimic the addLabel functionality of the Admin-on-rest FormField component
    // Otherwise, when the component is hidden, its label would be displayed anyway
    const addLabel = Component.defaultProps.addLabel;

    const DependantInputComponent = ({ show, ...props }) => {
        if (!show) return null;

        if (addLabel) {
            return (
                <Labeled {...props}>
                    <Component {...props} />
                </Labeled>
            );
        }

        return <Component {...props} />;
    };

    DependantInputComponent.propTypes = {
        show: PropTypes.bool.isRequired,
    };

    const mapStateToProps = mapStateToPropsFactory(source, value);
    const FinalComponent = connect(mapStateToProps)(DependantInputComponent);

    FinalComponent.propTypes = {
        ...Component.propTypes,
    };

    FinalComponent.defaultProps = {
        ...Component.defaultProps,
        addLabel: false,
    };

    return FinalComponent;
};
