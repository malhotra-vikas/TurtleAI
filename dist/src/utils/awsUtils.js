"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsUtils = void 0;
async function getSecret(client, secretArn) {
    return new Promise((resolve, reject) => {
        client.getSecretValue({ SecretId: secretArn }, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            if ('SecretString' in data) {
                resolve(data.SecretString);
            }
            else {
                resolve(Buffer.from(data.SecretBinary, 'base64').toString('ascii'));
            }
        });
    });
}
exports.awsUtils = { getSecret };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzVXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvYXdzVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsS0FBSyxVQUFVLFNBQVMsQ0FBQyxNQUEwQixFQUFFLFNBQWlCO0lBQ3BFLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMzRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ1gsT0FBTTthQUNQO1lBRUQsSUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO2dCQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQXNCLENBQUMsQ0FBQTthQUNyQztpQkFBTTtnQkFDTCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTthQUMzRTtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRVksUUFBQSxRQUFRLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEFXUyBmcm9tICdhd3Mtc2RrJ1xuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldFNlY3JldChjbGllbnQ6IEFXUy5TZWNyZXRzTWFuYWdlciwgc2VjcmV0QXJuOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNsaWVudC5nZXRTZWNyZXRWYWx1ZSh7IFNlY3JldElkOiBzZWNyZXRBcm4gfSwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCdTZWNyZXRTdHJpbmcnIGluIGRhdGEpIHtcbiAgICAgICAgcmVzb2x2ZShkYXRhLlNlY3JldFN0cmluZyBhcyBzdHJpbmcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKEJ1ZmZlci5mcm9tKGRhdGEuU2VjcmV0QmluYXJ5IGFzIGFueSwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdhc2NpaScpKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCBhd3NVdGlscyA9IHsgZ2V0U2VjcmV0IH0iXX0=