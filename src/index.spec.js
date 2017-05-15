import expect, { createSpy } from 'expect';
import { mapStateToProps } from './index';

describe('mapStateToProps', () => {
    describe('with resolve function', () => {
        it('returns { show: false } if the resolve returns false', () => {
            const resolve = createSpy().andReturn(false);
            expect(mapStateToProps({}, { resolve })).toEqual({ show: false });
        });

        it('returns { show: true } if the resolve returns true', () => {
            const resolve = createSpy().andReturn(true);
            expect(mapStateToProps({}, { resolve })).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as a string', () => {
        it('returns { show: false } if the form does not have a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    lastName: 'blublu',
                                },
                            },
                        },
                    },
                    {
                        dependsOn: 'firstName',
                    },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'blublu',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName' },
                ),
            ).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as a deep path string', () => {
        it('returns { show: false } if the form does not have a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    author: {
                                        lastName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: 'author.firstName' },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the form has a truthy value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    author: {
                                        firstName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: 'author.firstName' },
                ),
            ).toEqual({ show: true });
        });
    });

    describe('with dependsOn specified as a string and a specific value', () => {
        it('returns { show: false } if the form does not have the specific value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'bar',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName', value: 'foo' },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the form have the specific value for the field matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'foo',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName', value: 'foo' },
                ),
            ).toEqual({ show: true });
        });
    });

    describe('with dependsOn specified as a string and resolve', () => {
        it('returns { show: false } if the resolve function returns false', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'bar',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName', resolve: value => value === 'foo' },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the resolve function returns true', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'foo',
                                },
                            },
                        },
                    },
                    { dependsOn: 'firstName', resolve: value => value === 'foo' },
                ),
            ).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as an array', () => {
        it('returns { show: false } if the form does not have a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    lastName: 'blublu',
                                },
                            },
                        },
                    },
                    { dependsOn: ['firstName', 'lastName'] },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'blublu',
                                    lastName: 'blublu',
                                },
                            },
                        },
                    },
                    { dependsOn: ['firstName', 'lastName'] },
                ),
            ).toEqual({ show: true });
        });
    });

    describe('with only dependsOn specified as an array with deep path strings', () => {
        it('returns { show: false } if the form does not have a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    date: new Date().toDateString(),
                                    author: {
                                        lastName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: ['author.firstName', 'date'] },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the form has a truthy value for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    date: new Date().toDateString(),
                                    author: {
                                        firstName: 'blublu',
                                    },
                                },
                            },
                        },
                    },
                    { dependsOn: ['author.firstName', 'date'] },
                ),
            ).toEqual({ show: true });
        });
    });

    describe('with dependsOn specified as an array and specific values as an array', () => {
        it('returns { show: false } if the form does not have the specific values for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'bar',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        value: ['foo', 'bar'],
                    },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the form have the specific values for the fields matching dependsOn', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'foo',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        value: ['foo', 'bar'],
                    },
                ),
            ).toEqual({ show: true });
        });
    });

    describe('with dependsOn specified as an array and resolve', () => {
        it('returns { show: false } if the resolve function returns false', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'bar',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        resolve: values => {
                            return values.author.firstName === 'foo' && values.category === 'bar';
                        },
                    },
                ),
            ).toEqual({ show: false });
        });

        it('returns { show: true } if the resolve function returns true', () => {
            expect(
                mapStateToProps(
                    {
                        form: {
                            'record-form': {
                                values: {
                                    category: 'bar',
                                    author: {
                                        firstName: 'foo',
                                    },
                                },
                            },
                        },
                    },
                    {
                        dependsOn: ['author.firstName', 'category'],
                        resolve: values => {
                            return values.author.firstName === 'foo' && values.category === 'bar';
                        },
                    },
                ),
            ).toEqual({ show: true });
        });
    });
});
