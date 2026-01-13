import { config } from '@n8n/node-cli/eslint';

export default [
    ...config,
    {
        // Disable restriction on external dependencies for self-hosted n8n usage
        rules: {
            '@n8n/community-nodes/no-restricted-imports': 'off',
        },
    },
];
