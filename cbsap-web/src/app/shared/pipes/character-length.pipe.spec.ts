import { CharacterLengthPipe } from './character-length.pipe';

describe('CharacterLengthPipe', () => {
  it('create an instance', () => {
    const pipe = new CharacterLengthPipe();
    expect(pipe).toBeTruthy();
  });
});
