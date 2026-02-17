export function checkCharacters(input: string): boolean {
  const validCharacters = /^[a-zA-Z0-9-]+$/;
  return validCharacters.test(input);
}