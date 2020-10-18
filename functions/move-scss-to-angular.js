const fs = require('fs-extra');

console.log(" ~ move-scss-to-angular.js ~ Managing assets copy to functions");

(async() => {
    const src = './assets/server';
    const copy = '../src/assets/server';

    console.log(" ~ move-scss-to-angular.js ~ Clearing up old copy");

    await fs.remove(copy);

    console.log(" ~ move-scss-to-angular.js ~ Creating new copy to functions");

    await fs.copy(src, copy);

    console.log(" ~ move-scss-to-angular.js ~ Management for assets copy to functions complete");
})();
