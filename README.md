# aor-dependent-input

[![Build Status](https://travis-ci.org/marmelab/aor-dependent-input.svg?branch=master)](https://travis-ci.org/marmelab/aor-dependent-input)

An [Higher Order Component (HOC)](https://facebook.github.io/react/docs/higher-order-components.html) for having input display depending on other inputs values in [Admin-on-rest](https://github.com/marmelab/admin-on-rest).

- [Installation](#installation)
- [Usage](#installation)
- [Options](#options)

## Installation

Install with:

```sh
npm install --save aor-dependent-input
```

or

```sh
yarn add aor-dependent-input
```

## Usage

Check that the source field has a value (a truthy value):

```js
const DependentTextInput = withDependency('hasEmail')(TextInput);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <BooleanInput source="hasEmail" label="Has email ?" />
            <DependentTextInput source="email" />
        </SimpleForm>
    </Create>
);
```

Check that the source field has a specific value:

```js
const ProgramingSelectInput = withDependency('category', 'programming')(SelectInput);

const ProgramingSelectInput = withDependency('category', 'lifestyle')(SelectInput);

const ProgramingSelectInput = withDependency('category', 'photography')(SelectInput);

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <SelectInput source="category" choices={[
                { id: 'programming', name: 'Programming' },
                { id: 'lifestyle', name: 'Lifestyle' },
                { id: 'photography', name: 'Photography' },
            ]} />
            <DependentSelectInput source="subcategory" choices={[
                { id: 'js', name: 'JavaScript' },
                { id: 'net', name: '.NET' },
                { id: 'java', name: 'Java' },
            ]} />
            <DependentSelectInput source="subcategory" choices={[
                ...
            ]} />
            <DependentSelectInput source="subcategory" choices={[
                ...
            ]} />
        </SimpleForm>
    </Create>
);
```

Check that the source field matches a custom constraint:

```js
const ProgramingSelectInput = withDependency('category', (value) => value.startsWith('programming'))(SelectInput);

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />
            <SelectInput source="category" choices={[
                    { id: 'programming_js', name: 'JavaScript' },
                    { id: 'programming_net', name: '.NET' },
                    { id: 'programming_java', name: 'Java' },
                    { id: 'lifestyle', name: 'Lifestyle' },
                    { id: 'photography', name: 'Photography' },
            ]} />
            <ProgramingSelectInput source="subcategory" choices={[
                { id: 'js', name: 'JavaScript' },
                { id: 'net', name: '.NET' },
                { id: 'java', name: 'Java' },
            ]} />
        </SimpleForm>
    </Create>
);
```

All powers! Check whether the current full record matches your constraints:

```js
const EmailInput = withDependency((record) => record.firstName && record.lastName)(SelectInput);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <EmailInput source="email" />
        </SimpleForm>
    </Create>
);
```

## API

There are three signatures for the `withDependency` HOC:

- `withDependency(source: String|Array)`: will check if the current form has values for the specified source(s)
- `withDependency(source: String|Array, value: String|Array|Function)`: will check if the current form has specific value(s) for the specified source(s)
- `withDependency(validator: Function)`: will check if the current form values matches custom constraints

### source

Either a string indicating the name of the field to check (eg: `hasEmail`) or an array of fields to check (eg: `['firstName', 'lastName']`).

`withDependency` uses the [formValueSelector](http://redux-form.com/6.7.0/docs/api/FormValueSelector.md) from `redux-form` to retrieve the value(s). That means you can specify deep paths such as `author.firstName`.

### value

If not specified, the `withDependency` HOC will only check that the source or sources have a truthy value.

If a function is passed, it will be called with either the source value (when a single field name was specified as `source`) or with an object matching the specified paths. This function must return `true` to display the child input or `false` to hide it.

**Note**: When specifying deep paths (eg: `author.firstName`), `redux-form` will return an object with a matching structure. For example, when passing `['author.firstName', 'author.lastName']` as source, the `value` function will be passed the following object:

```js
{ author: { firstName: 'bValue', lastName: 'cValue' } }
```

Otherwise, you may specify a single value or an array of values. Deep path sources will be correctly retrieved and compared to the specified values.

### validator

A function to which the current form values will be passed. This function must return `true` to display the child input or `false` to hide it.

## Contributing

Run the tests with this command:

```sh
make test
```

Coverage data is available in `./coverage` after executing `make test`.

An HTML report is generated in `./coverage/lcov-report/index.html`.
