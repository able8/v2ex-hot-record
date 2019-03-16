const fetch = require('node-fetch');
const Octokit = require('@octokit/rest');

const octokit = new Octokit({
    auth: 'token xxx',
});

const name = 'xxx';
const email = 'xxx';
const repo = 'v2ex-hot-record';

exports.handler = function(event, context, callback) {
    fetch('https://www.v2ex.com/api/topics/hot.json')
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            const rawContent = data
                .map(item => `- [${item.title}](${item.url}) ${item.replies}`)
                .join('\n');
            const fileName = new Date().toISOString().substr(0, 10) + '.md';
            const content = Buffer.from(rawContent).toString('base64');

            octokit.repos
                .createFile({
                    owner: name,
                    repo,
                    path: fileName,
                    message: fileName,
                    content,
                    'committer:name': name,
                    'committer:email': email,
                    'author:name': name,
                    'author:email': email,
                })
                .then(() => {
                    callback(null, '');
                });
        });
};
