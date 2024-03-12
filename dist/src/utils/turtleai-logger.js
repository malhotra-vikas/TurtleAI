"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customContextLogger = exports.customLogger = void 0;
function customLogger(message) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message);
    }
}
exports.customLogger = customLogger;
function customContextLogger(message, context) {
    if (process.env.NODE_ENV !== 'production') {
        console.log(message, context);
    }
}
exports.customContextLogger = customContextLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHVydGxlYWktbG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL3R1cnRsZWFpLWxvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxTQUFnQixZQUFZLENBQUMsT0FBZTtJQUN4QyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksRUFBRTtRQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ3ZCO0FBQ0wsQ0FBQztBQUpELG9DQUlDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsT0FBZSxFQUFFLE9BQVk7SUFDN0QsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLEVBQUU7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDaEM7QUFDTCxDQUFDO0FBSkQsa0RBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY3VzdG9tTG9nZ2VyKG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tQ29udGV4dExvZ2dlcihtZXNzYWdlOiBzdHJpbmcsIGNvbnRleHQ6IGFueSkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIGNvbnRleHQpXG4gICAgfVxufVxuXG5cbiJdfQ==