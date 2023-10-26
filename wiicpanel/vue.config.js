const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        allowedHosts: [
            'localhost',
            'vps.megacorp.tech',
            '162.248.102.181',
        ],
    },
})
