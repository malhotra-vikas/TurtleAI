"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../src/api/user");
describe('validatePhone', () => {
    it('should validate phone numbers with country code +1', () => {
        expect((0, user_1.validatePhone)('+14135551234')).toEqual([]);
        expect((0, user_1.validatePhone)('+1-413-555-1234')).toEqual([]);
        expect((0, user_1.validatePhone)('+1 413 555 1234')).toEqual([]);
        expect((0, user_1.validatePhone)('+1 (413) 555-1234')).toEqual([]);
        expect((0, user_1.validatePhone)('+1 (413) 555 1234')).toEqual([]);
    });
    it('should validate phone numbers with country code 1', () => {
        expect((0, user_1.validatePhone)('14135551234')).toEqual([]);
        expect((0, user_1.validatePhone)('1-413-555-1234')).toEqual([]);
        expect((0, user_1.validatePhone)('1 413 555 1234')).toEqual([]);
        expect((0, user_1.validatePhone)('1 (413) 555-1234')).toEqual([]);
        expect((0, user_1.validatePhone)('1 (413)-555 1234')).toEqual([]);
    });
    it('should not validate phone numbers without the required country code', () => {
        expect((0, user_1.validatePhone)('4135551234')).not.toEqual([]);
        expect((0, user_1.validatePhone)('(413) 555-1234')).not.toEqual([]);
    });
    it('should not validate invalid phone numbers', () => {
        expect((0, user_1.validatePhone)('+1 413-555-123')).not.toEqual([]);
        expect((0, user_1.validatePhone)('1413555123')).not.toEqual([]);
        expect((0, user_1.validatePhone)('abcd')).not.toEqual([]);
        expect((0, user_1.validatePhone)(' ')).not.toEqual([]);
        expect((0, user_1.validatePhone)('123456789012')).not.toEqual([]);
    });
    it('should not validate Non US phone numbers', () => {
        expect((0, user_1.validatePhone)('+919891621308')).not.toEqual([]);
        expect((0, user_1.validatePhone)('919891621308')).not.toEqual([]);
        expect((0, user_1.validatePhone)('9192982020')).not.toEqual([]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNC12YWxpZGF0ZVBob25lLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyI0LXZhbGlkYXRlUGhvbmUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUErQztBQUUvQyxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUMzQixFQUFFLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1FBQzFELE1BQU0sQ0FBQyxJQUFBLG9CQUFhLEVBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDakQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3BELE1BQU0sQ0FBQyxJQUFBLG9CQUFhLEVBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNwRCxNQUFNLENBQUMsSUFBQSxvQkFBYSxFQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDdEQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzFELENBQUMsQ0FBQyxDQUFBO0lBRUYsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUN6RCxNQUFNLENBQUMsSUFBQSxvQkFBYSxFQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELE1BQU0sQ0FBQyxJQUFBLG9CQUFhLEVBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNuRCxNQUFNLENBQUMsSUFBQSxvQkFBYSxFQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDbkQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3JELE1BQU0sQ0FBQyxJQUFBLG9CQUFhLEVBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxxRUFBcUUsRUFBRSxHQUFHLEVBQUU7UUFDM0UsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDbkQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMzRCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDakQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN2RCxNQUFNLENBQUMsSUFBQSxvQkFBYSxFQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNuRCxNQUFNLENBQUMsSUFBQSxvQkFBYSxFQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUM3QyxNQUFNLENBQUMsSUFBQSxvQkFBYSxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUMxQyxNQUFNLENBQUMsSUFBQSxvQkFBYSxFQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDaEQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDdEQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDckQsTUFBTSxDQUFDLElBQUEsb0JBQWEsRUFBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDdkQsQ0FBQyxDQUFDLENBQUE7QUFFTixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHZhbGlkYXRlUGhvbmUgfSBmcm9tIFwiLi4vc3JjL2FwaS91c2VyXCJcblxuZGVzY3JpYmUoJ3ZhbGlkYXRlUGhvbmUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBwaG9uZSBudW1iZXJzIHdpdGggY291bnRyeSBjb2RlICsxJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnKzE0MTM1NTUxMjM0JykpLnRvRXF1YWwoW10pXG4gICAgICAgIGV4cGVjdCh2YWxpZGF0ZVBob25lKCcrMS00MTMtNTU1LTEyMzQnKSkudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlUGhvbmUoJysxIDQxMyA1NTUgMTIzNCcpKS50b0VxdWFsKFtdKVxuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnKzEgKDQxMykgNTU1LTEyMzQnKSkudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlUGhvbmUoJysxICg0MTMpIDU1NSAxMjM0JykpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdmFsaWRhdGUgcGhvbmUgbnVtYmVycyB3aXRoIGNvdW50cnkgY29kZSAxJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnMTQxMzU1NTEyMzQnKSkudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlUGhvbmUoJzEtNDEzLTU1NS0xMjM0JykpLnRvRXF1YWwoW10pXG4gICAgICAgIGV4cGVjdCh2YWxpZGF0ZVBob25lKCcxIDQxMyA1NTUgMTIzNCcpKS50b0VxdWFsKFtdKVxuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnMSAoNDEzKSA1NTUtMTIzNCcpKS50b0VxdWFsKFtdKVxuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnMSAoNDEzKS01NTUgMTIzNCcpKS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB2YWxpZGF0ZSBwaG9uZSBudW1iZXJzIHdpdGhvdXQgdGhlIHJlcXVpcmVkIGNvdW50cnkgY29kZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlUGhvbmUoJzQxMzU1NTEyMzQnKSkubm90LnRvRXF1YWwoW10pXG4gICAgICAgIGV4cGVjdCh2YWxpZGF0ZVBob25lKCcoNDEzKSA1NTUtMTIzNCcpKS5ub3QudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdmFsaWRhdGUgaW52YWxpZCBwaG9uZSBudW1iZXJzJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnKzEgNDEzLTU1NS0xMjMnKSkubm90LnRvRXF1YWwoW10pXG4gICAgICAgIGV4cGVjdCh2YWxpZGF0ZVBob25lKCcxNDEzNTU1MTIzJykpLm5vdC50b0VxdWFsKFtdKVxuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnYWJjZCcpKS5ub3QudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlUGhvbmUoJyAnKSkubm90LnRvRXF1YWwoW10pXG4gICAgICAgIGV4cGVjdCh2YWxpZGF0ZVBob25lKCcxMjM0NTY3ODkwMTInKSkubm90LnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHZhbGlkYXRlIE5vbiBVUyBwaG9uZSBudW1iZXJzJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodmFsaWRhdGVQaG9uZSgnKzkxOTg5MTYyMTMwOCcpKS5ub3QudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlUGhvbmUoJzkxOTg5MTYyMTMwOCcpKS5ub3QudG9FcXVhbChbXSlcbiAgICAgICAgZXhwZWN0KHZhbGlkYXRlUGhvbmUoJzkxOTI5ODIwMjAnKSkubm90LnRvRXF1YWwoW10pXG4gICAgfSlcbiAgICBcbn0pXG4iXX0=