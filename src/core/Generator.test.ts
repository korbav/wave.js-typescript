import Generator from '../core/Generator';

describe('Generator', () => {
  it('should define the appropriate generators', () => {
    expect(Object.values(Generator)).toMatchSnapshot();
  });
});
