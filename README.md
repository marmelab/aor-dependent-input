# aor-dependent-input

[![Build Status](https://travis-ci.org/marmelab/aor-dependent-input.svg?branch=master)](https://travis-ci.org/marmelab/aor-dependent-input)

A component for displaying input depending on other inputs values in [Admin-on-rest](https://github.com/marmelab/admin-on-rest).

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

Check that the field specified by `dependsOn` has a value (a truthy value):

```js
import DependentInput from 'aor-dependent-input';

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />
            <BooleanInput source="hasEmail" label="Has email ?" />
            <DependentInput dependsOn="hasEmail">
                <TextInput source="email" />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

Check that the field specified by `dependsOn` has a specific value:

```js
import DependentInput from 'aor-dependent-input';

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" />

            <SelectInput source="category" choices={[
                { id: 'programming', name: 'Programming' },
                { id: 'lifestyle', name: 'Lifestyle' },
                { id: 'photography', name: 'Photography' },
            ]} />

            <DependentInput dependsOn="category" value="programming">
                <SelectInput source="subcategory" choices={[
                    { id: 'js', name: 'JavaScript' },
                    { id: 'net', name: '.NET' },
                    { id: 'java', name: 'Java' },
                ]} />
            </DependentInput>

            <DependentInput dependsOn="category" value="lifestyle">
                <SelectInput source="subcategory" choices={[
                    ...
                ]} />
            </DependentInput>

            <DependentInput dependsOn="category" value="photography">
                <SelectInput source="subcategory" choices={[
                    ...
                ]} />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

Check that the field specified by `dependsOn` matches a custom constraint:

```js
import DependentInput from 'aor-dependent-input';

const checkCustomConstraint = (value) => value.startsWith('programming'));

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

            <DependentInput dependsOn="category" resolve={checkCustomConstraint}>
                <SelectInput source="subcategory" choices={[
                    { id: 'js', name: 'JavaScript' },
                    { id: 'net', name: '.NET' },
                    { id: 'java', name: 'Java' },
                ]} />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

All powers! Check whether the current full record matches your constraints:

```js
import DependentInput from 'aor-dependent-input';

const checkRecord = (record) => record.firstName && record.lastName);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="firstName" />
            <TextInput source="lastName" />

            <DependentInput resolve={checkRecord}>
                <EmailInput source="email" />
            </DependentInput>
        </SimpleForm>
    </Create>
);
```

## API

The `DependentInput` accepts the following props:

### dependsOn

Either a string indicating the name of the field to check (eg: `hasEmail`) or an array of fields to check (eg: `['firstName', 'lastName']`).

`DependentInput` uses the [formValueSelector](http://redux-form.com/6.7.0/docs/api/FormValueSelector.md) from `redux-form` to retrieve the value(s). That means you can specify deep paths such as `author.firstName`.

### value

If not specified, `DependentInput` will only check that the field(s) specified by `dependsOn` have a truthy value.

You may specify a single value or an array of values. Deep paths will be correctly retrieved and compared to the specified values.

If both `value` and `record` are specified, `value` will be ignored.

### resolve

The `resolve` prop accepts a function which must return either `true` to display the child input or `false` to hide it.

If the `dependsOn` prop is specified, `resolve` will be called with either the value of the field specified by `dependsOn` (when a single field name was specified as `dependsOn`) or with an object matching the specified paths.

**Note**: When specifying deep paths (eg: `author.firstName`), `redux-form` will return an object with a matching structure. For example, when passing `['author.firstName', 'author.lastName']` as `dependsOn`, the `value` function will be passed the following object:

```js
{ author: { firstName: 'bValue', lastName: 'cValue' } }
```

If `dependsOn` is not specified, `resolve` will be called with the current form values (full record).

If both `value` and `record` are specified, `value` will be ignored.

## Contributing

Run the tests with this command:

```sh
make test
```

Coverage data is available in `./coverage` after executing `make test`.

An HTML report is generated in `./coverage/lcov-report/index.html`.
