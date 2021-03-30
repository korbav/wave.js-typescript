import defaultOptions from './default-options';

describe('defaultOptions', () => {
  it('should match the expected set of options', () => {
    expect(defaultOptions).toMatchSnapshot();
  });
});
