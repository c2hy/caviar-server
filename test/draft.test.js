
const bcrypt = require('bcrypt');

async function test() {
    console.info(await bcrypt.hash("666666", 13))
}

test()