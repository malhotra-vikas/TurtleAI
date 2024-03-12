"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readQueryParamsFromEvent = exports.readUserFromEvent = exports.readUserFromUpdateEvent = void 0;
const region = 'us-east-1';
const localTestCases = process.env.RUNNING_LOCAL_TESTS;
const response = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json'
    },
    isBase64Encoded: false,
    body: ''
};
async function convertBodyToUser(body) {
    if (localTestCases == 'yes') {
        const parsedBody = JSON.parse(body);
        return {
            email: parsedBody["email"],
            firstName: parsedBody["firstName"],
            lastName: parsedBody['lastName'],
            phone: parsedBody['phone'],
            lists: parsedBody['lists'],
            tags: parsedBody['tags'],
            customFields: parsedBody['customFields'],
            verified: parsedBody['verified']
        };
    }
    else {
        return {
            //@ts-ignore
            email: body['email'],
            //@ts-ignore
            firstName: body['firstName'],
            //@ts-ignore
            lastName: body['lastName'],
            //@ts-ignore
            phone: body['phone'],
            //@ts-ignore
            lists: body['lists'],
            //@ts-ignore
            tags: body['tags'],
            //@ts-ignore
            customFields: body['customFields'],
            //@ts-ignore
            verified: body['verified']
        };
    }
}
async function readUserFromUpdateEvent(body) {
    console.log("in readUserFromUpdateEvent " + body);
    const contact = JSON.parse(body);
    if (localTestCases == 'yes') {
        //const parsedBody = JSON.parse(body)
        //console.log("in readUserFromUpdateEvent " + parsedBody)
        return {
            contactId: contact.contactId,
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
            phone: contact.phone,
            lists: contact.lists,
            tags: contact.tags,
            customFields: contact.customFields,
            verified: contact.verified,
            owner: contact.owner,
        };
    }
    else {
        return {
            //@ts-ignore
            contactId: body['contactId'],
            //@ts-ignore
            email: body['email'],
            //@ts-ignore
            firstName: body['firstName'],
            //@ts-ignore
            lastName: body['lastName'],
            //@ts-ignore
            phone: body['phone'],
            //@ts-ignore
            lists: body['lists'],
            //@ts-ignore
            tags: body['tags'],
            //@ts-ignore
            customFields: body['customFields'],
            //@ts-ignore
            verified: body['verified'],
            //@ts-ignore
            owner: body['owner'],
        };
    }
}
exports.readUserFromUpdateEvent = readUserFromUpdateEvent;
async function readUserFromEvent(body) {
    if (localTestCases == 'yes') {
        //const parsedBody = JSON.parse(body)
        const parsedBody = JSON.parse(body);
        console.log(parsedBody);
        return {
            contactId: parsedBody["contactId"],
            email: parsedBody["email"],
            firstName: parsedBody["firstName"],
            lastName: parsedBody['lastName'],
            phone: parsedBody['phone'],
            lists: parsedBody['lists'],
            tags: parsedBody['tags'],
            customFields: parsedBody['customFields'],
            verified: parsedBody['verified'],
            owner: parsedBody['owner'],
            message: parsedBody['message']
        };
    }
    else {
        const parsedBody = JSON.parse(body);
        console.log(parsedBody);
        return {
            //@ts-ignore
            contactId: parsedBody["contactId"],
            //@ts-ignore
            email: parsedBody["email"],
            //@ts-ignore
            firstName: parsedBody["firstName"],
            //@ts-ignore
            lastName: parsedBody['lastName'],
            //@ts-ignore
            phone: parsedBody['phone'],
            //@ts-ignore
            lists: parsedBody['lists'],
            //@ts-ignore
            tags: parsedBody['tags'],
            //@ts-ignore
            customFields: parsedBody['customFields'],
            //@ts-ignore
            verified: parsedBody['verified'],
            //@ts-ignore
            owner: parsedBody['owner'],
            message: parsedBody['message']
        };
    }
}
exports.readUserFromEvent = readUserFromEvent;
async function readQueryParamsFromEvent(body) {
    if (localTestCases == 'yes') {
        const parsedBody = JSON.parse(body);
        return {
            email: parsedBody["email"],
            contactId: parsedBody["contactId"]
        };
    }
    else {
        return {
            //@ts-ignore
            email: body['email'],
            //@ts-ignore
            contactId: body['contactId']
        };
    }
}
exports.readQueryParamsFromEvent = readQueryParamsFromEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFBO0FBRTFCLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUE7QUFFdEQsTUFBTSxRQUFRLEdBQUc7SUFDZixVQUFVLEVBQUUsR0FBRztJQUNmLE9BQU8sRUFBRTtRQUNQLDZCQUE2QixFQUFFLEdBQUc7UUFDbEMsY0FBYyxFQUFFLGtCQUFrQjtLQUNuQztJQUNELGVBQWUsRUFBRSxLQUFLO0lBQ3RCLElBQUksRUFBRSxFQUFFO0NBQ1QsQ0FBQTtBQUVELEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxJQUFZO0lBRTNDLElBQUksY0FBYyxJQUFJLEtBQUssRUFBRTtRQUMzQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRW5DLE9BQU87WUFDTCxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUMxQixTQUFTLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQztZQUNsQyxRQUFRLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUNoQyxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUMxQixLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUMxQixJQUFJLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQztZQUN4QixZQUFZLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQztZQUN4QyxRQUFRLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQztTQUNqQyxDQUFBO0tBQ0Y7U0FBTTtRQUNMLE9BQU87WUFDTCxZQUFZO1lBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDcEIsWUFBWTtZQUNaLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzVCLFlBQVk7WUFD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LE9BQU87WUFDTCxLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQztZQUMxQixTQUFTLEVBQUUsVUFBVSxDQUFDLFdBQVcsQ0FBQztTQUNuQyxDQUFBO0tBQ0Y7U0FBTTtRQUNMLE9BQU87WUFDTCxZQUFZO1lBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDcEIsWUFBWTtZQUNaLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzdCLENBQUE7S0FDRjtBQUNILENBQUM7QUFoQkQsNERBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXNlclR5cGUgfSBmcm9tICcuL3V0aWxzL3VzZXInXG5cbmNvbnN0IHJlZ2lvbiA9ICd1cy1lYXN0LTEnXG5cbmNvbnN0IGxvY2FsVGVzdENhc2VzID0gcHJvY2Vzcy5lbnYuUlVOTklOR19MT0NBTF9URVNUU1xuXG5jb25zdCByZXNwb25zZSA9IHtcbiAgc3RhdHVzQ29kZTogMjAwLFxuICBoZWFkZXJzOiB7XG4gICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH0sXG4gIGlzQmFzZTY0RW5jb2RlZDogZmFsc2UsXG4gIGJvZHk6ICcnXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvbnZlcnRCb2R5VG9Vc2VyKGJvZHk6IHN0cmluZyk6IFByb21pc2U8VXNlclR5cGU+IHtcblxuICBpZiAobG9jYWxUZXN0Q2FzZXMgPT0gJ3llcycpIHtcbiAgICBjb25zdCBwYXJzZWRCb2R5ID0gSlNPTi5wYXJzZShib2R5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGVtYWlsOiBwYXJzZWRCb2R5W1wiZW1haWxcIl0sXG4gICAgICBmaXJzdE5hbWU6IHBhcnNlZEJvZHlbXCJmaXJzdE5hbWVcIl0sXG4gICAgICBsYXN0TmFtZTogcGFyc2VkQm9keVsnbGFzdE5hbWUnXSxcbiAgICAgIHBob25lOiBwYXJzZWRCb2R5WydwaG9uZSddLFxuICAgICAgbGlzdHM6IHBhcnNlZEJvZHlbJ2xpc3RzJ10sXG4gICAgICB0YWdzOiBwYXJzZWRCb2R5Wyd0YWdzJ10sXG4gICAgICBjdXN0b21GaWVsZHM6IHBhcnNlZEJvZHlbJ2N1c3RvbUZpZWxkcyddLFxuICAgICAgdmVyaWZpZWQ6IHBhcnNlZEJvZHlbJ3ZlcmlmaWVkJ11cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZW1haWw6IGJvZHlbJ2VtYWlsJ10sXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGZpcnN0TmFtZTogYm9keVsnZmlyc3ROYW1lJ10sXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGxhc3ROYW1lOiBib2R5WydsYXN0TmFtZSddLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBwaG9uZTogYm9keVsncGhvbmUnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgbGlzdHM6IGJvZHlbJ2xpc3RzJ10sXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHRhZ3M6IGJvZHlbJ3RhZ3MnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgY3VzdG9tRmllbGRzOiBib2R5WydjdXN0b21GaWVsZHMnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgdmVyaWZpZWQ6IGJvZHlbJ3ZlcmlmaWVkJ11cbiAgICB9XG4gIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVhZFVzZXJGcm9tVXBkYXRlRXZlbnQoYm9keTogc3RyaW5nKTogUHJvbWlzZTxVc2VyVHlwZT4ge1xuICBjb25zb2xlLmxvZyhcImluIHJlYWRVc2VyRnJvbVVwZGF0ZUV2ZW50IFwiICsgYm9keSlcbiAgY29uc3QgY29udGFjdDogVXNlclR5cGUgPSBKU09OLnBhcnNlKGJvZHkpXG5cbiAgaWYgKGxvY2FsVGVzdENhc2VzID09ICd5ZXMnKSB7XG4gICAgLy9jb25zdCBwYXJzZWRCb2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgIC8vY29uc29sZS5sb2coXCJpbiByZWFkVXNlckZyb21VcGRhdGVFdmVudCBcIiArIHBhcnNlZEJvZHkpXG5cbiAgICByZXR1cm4ge1xuICAgICAgY29udGFjdElkOiBjb250YWN0LmNvbnRhY3RJZCxcbiAgICAgIGVtYWlsOiBjb250YWN0LmVtYWlsLFxuICAgICAgZmlyc3ROYW1lOiBjb250YWN0LmZpcnN0TmFtZSxcbiAgICAgIGxhc3ROYW1lOiBjb250YWN0Lmxhc3ROYW1lLFxuICAgICAgcGhvbmU6IGNvbnRhY3QucGhvbmUsXG4gICAgICBsaXN0czogY29udGFjdC5saXN0cyxcbiAgICAgIHRhZ3M6IGNvbnRhY3QudGFncyxcbiAgICAgIGN1c3RvbUZpZWxkczogY29udGFjdC5jdXN0b21GaWVsZHMsXG4gICAgICB2ZXJpZmllZDogY29udGFjdC52ZXJpZmllZCxcbiAgICAgIG93bmVyOiBjb250YWN0Lm93bmVyLFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBjb250YWN0SWQ6IGJvZHlbJ2NvbnRhY3RJZCddLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBlbWFpbDogYm9keVsnZW1haWwnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgZmlyc3ROYW1lOiBib2R5WydmaXJzdE5hbWUnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgbGFzdE5hbWU6IGJvZHlbJ2xhc3ROYW1lJ10sXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHBob25lOiBib2R5WydwaG9uZSddLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBsaXN0czogYm9keVsnbGlzdHMnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgdGFnczogYm9keVsndGFncyddLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBjdXN0b21GaWVsZHM6IGJvZHlbJ2N1c3RvbUZpZWxkcyddLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICB2ZXJpZmllZDogYm9keVsndmVyaWZpZWQnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgb3duZXI6IGJvZHlbJ293bmVyJ10sXG5cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRVc2VyRnJvbUV2ZW50KGJvZHk6IHN0cmluZyk6IFByb21pc2U8VXNlclR5cGU+IHtcbiAgaWYgKGxvY2FsVGVzdENhc2VzID09ICd5ZXMnKSB7XG4gICAgLy9jb25zdCBwYXJzZWRCb2R5ID0gSlNPTi5wYXJzZShib2R5KVxuICAgIGNvbnN0IHBhcnNlZEJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgY29uc29sZS5sb2cocGFyc2VkQm9keSlcblxuICAgIHJldHVybiB7XG4gICAgICBjb250YWN0SWQ6IHBhcnNlZEJvZHlbXCJjb250YWN0SWRcIl0sXG4gICAgICBlbWFpbDogcGFyc2VkQm9keVtcImVtYWlsXCJdLFxuICAgICAgZmlyc3ROYW1lOiBwYXJzZWRCb2R5W1wiZmlyc3ROYW1lXCJdLFxuICAgICAgbGFzdE5hbWU6IHBhcnNlZEJvZHlbJ2xhc3ROYW1lJ10sXG4gICAgICBwaG9uZTogcGFyc2VkQm9keVsncGhvbmUnXSxcbiAgICAgIGxpc3RzOiBwYXJzZWRCb2R5WydsaXN0cyddLFxuICAgICAgdGFnczogcGFyc2VkQm9keVsndGFncyddLFxuICAgICAgY3VzdG9tRmllbGRzOiBwYXJzZWRCb2R5WydjdXN0b21GaWVsZHMnXSxcbiAgICAgIHZlcmlmaWVkOiBwYXJzZWRCb2R5Wyd2ZXJpZmllZCddLFxuICAgICAgb3duZXI6IHBhcnNlZEJvZHlbJ293bmVyJ10sXG4gICAgICBtZXNzYWdlOiBwYXJzZWRCb2R5WydtZXNzYWdlJ11cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcGFyc2VkQm9keSA9IEpTT04ucGFyc2UoYm9keSlcbiAgICBjb25zb2xlLmxvZyhwYXJzZWRCb2R5KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgY29udGFjdElkOiBwYXJzZWRCb2R5W1wiY29udGFjdElkXCJdLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBlbWFpbDogcGFyc2VkQm9keVtcImVtYWlsXCJdLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBmaXJzdE5hbWU6IHBhcnNlZEJvZHlbXCJmaXJzdE5hbWVcIl0sXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIGxhc3ROYW1lOiBwYXJzZWRCb2R5WydsYXN0TmFtZSddLFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBwaG9uZTogcGFyc2VkQm9keVsncGhvbmUnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgbGlzdHM6IHBhcnNlZEJvZHlbJ2xpc3RzJ10sXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHRhZ3M6IHBhcnNlZEJvZHlbJ3RhZ3MnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgY3VzdG9tRmllbGRzOiBwYXJzZWRCb2R5WydjdXN0b21GaWVsZHMnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgdmVyaWZpZWQ6IHBhcnNlZEJvZHlbJ3ZlcmlmaWVkJ10sXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIG93bmVyOiBwYXJzZWRCb2R5Wydvd25lciddLFxuICAgICAgbWVzc2FnZTogcGFyc2VkQm9keVsnbWVzc2FnZSddXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWFkUXVlcnlQYXJhbXNGcm9tRXZlbnQoYm9keTogc3RyaW5nKSB7XG4gIGlmIChsb2NhbFRlc3RDYXNlcyA9PSAneWVzJykge1xuICAgIGNvbnN0IHBhcnNlZEJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG5cbiAgICByZXR1cm4ge1xuICAgICAgZW1haWw6IHBhcnNlZEJvZHlbXCJlbWFpbFwiXSxcbiAgICAgIGNvbnRhY3RJZDogcGFyc2VkQm9keVtcImNvbnRhY3RJZFwiXVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICBlbWFpbDogYm9keVsnZW1haWwnXSxcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgY29udGFjdElkOiBib2R5Wydjb250YWN0SWQnXVxuICAgIH1cbiAgfVxufVxuIl19