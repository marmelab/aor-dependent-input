import expect, { createSpy } from 'expect';
import { mapStateToPropsFactory } from './index';

describe('withDependency', () => {
    describe('mapStateToProps', () => {
        describe('with validator function', () => {
            it('returns { show: false } if the validator returns false', () => {
                const validator = createSpy().andReturn(false);
                const mapStateToProps = mapStateToPropsFactory(validator);

                expect(mapStateToProps()).toEqual({ show: false });
            });

            it('returns { show: true } if the validator returns true', () => {
                const validator = createSpy().andReturn(true);
                const mapStateToProps = mapStateToPropsFactory(validator);

                expect(mapStateToProps()).toEqual({ show: true });
            });
        });

        describe('with only source specified as a string', () => {
            it('returns { show: false } if the form does not have a truthy value for the field matching source', () => {
                const mapStateToProps = mapStateToPropsFactory('firstName');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    lastName: 'blublu',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the form has a truthy value for the field matching source', () => {
                const mapStateToProps = mapStateToPropsFactory('firstName');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'blublu',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: true });
            });
        });

        describe('with only source specified as a deep path string', () => {
            it('returns { show: false } if the form does not have a truthy value for the field matching source', () => {
                const mapStateToProps = mapStateToPropsFactory('author.firstName');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    author: {
                                        lastName: 'blublu',
                                    },
                                },
                            },
                        },
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the form has a truthy value for the field matching source', () => {
                const mapStateToProps = mapStateToPropsFactory('author.firstName');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    author: {
                                        firstName: 'blublu',
                                    },
                                },
                            },
                        },
                    }),
                ).toEqual({ show: true });
            });
        });

        describe('with source specified as a string and a specific value', () => {
            it('returns { show: false } if the form does not have the specific value for the field matching source', () => {
                const mapStateToProps = mapStateToPropsFactory('firstName', 'foo');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'bar',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the form have the specific value for the field matching source', () => {
                const mapStateToProps = mapStateToPropsFactory('firstName', 'foo');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'foo',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: true });
            });
        });

        describe('with source specified as a string and a function as value', () => {
            it('returns { show: false } if the value function returns false', () => {
                const mapStateToProps = mapStateToPropsFactory('firstName', value => value === 'foo');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'bar',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the value function returns true', () => {
                const mapStateToProps = mapStateToPropsFactory('firstName', value => value === 'foo');

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'foo',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: true });
            });
        });

        describe('with only source specified as an array', () => {
            it('returns { show: false } if the form does not have a truthy value for the fields matching source', () => {
                const mapStateToProps = mapStateToPropsFactory(['firstName', 'lastName']);

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    lastName: 'blublu',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the form has a truthy value for the fields matching source', () => {
                const mapStateToProps = mapStateToPropsFactory(['firstName', 'lastName']);

                expect(
                    mapStateToProps({
                        form: {
                            'record-form': {
                                values: {
                                    firstName: 'blublu',
                                    lastName: 'blublu',
                                },
                            },
                        },
                    }),
                ).toEqual({ show: true });
            });
        });

        describe('with only source specified as an array with deep path strings', () => {
            it('returns { show: false } if the form does not have a truthy value for the fields matching source', () => {
                const mapStateToProps = mapStateToPropsFactory(['author.firstName', 'date']);

                expect(
                    mapStateToProps({
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
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the form has a truthy value for the fields matching source', () => {
                const mapStateToProps = mapStateToPropsFactory(['author.firstName', 'date']);

                expect(
                    mapStateToProps({
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
                    }),
                ).toEqual({ show: true });
            });
        });

        describe('with source specified as an array and specific values as an array', () => {
            it('returns { show: false } if the form does not have the specific values for the fields matching source', () => {
                const mapStateToProps = mapStateToPropsFactory(['author.firstName', 'category'], ['foo', 'bar']);

                expect(
                    mapStateToProps({
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
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the form have the specific values for the fields matching source', () => {
                const mapStateToProps = mapStateToPropsFactory(['author.firstName', 'category'], ['foo', 'bar']);

                expect(
                    mapStateToProps({
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
                    }),
                ).toEqual({ show: true });
            });
        });

        describe('with source specified as an array and a function as value', () => {
            it('returns { show: false } if the value function returns false', () => {
                const mapStateToProps = mapStateToPropsFactory(['author.firstName', 'category'], values => {
                    return values.author.firstName === 'foo' && values.category === 'bar';
                });

                expect(
                    mapStateToProps({
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
                    }),
                ).toEqual({ show: false });
            });

            it('returns { show: true } if the value function returns true', () => {
                const mapStateToProps = mapStateToPropsFactory(['author.firstName', 'category'], values => {
                    return values.author.firstName === 'foo' && values.category === 'bar';
                });

                expect(
                    mapStateToProps({
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
                    }),
                ).toEqual({ show: true });
            });
        });
    });
});
