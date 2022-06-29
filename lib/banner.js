module.exports = function(packageJson, config) {

    const
        banner = config.banner.join('\n') + '\n',
        info = {
            name:  packageJson.name || '',
            description: packageJson.description || '',
            version: packageJson.version || '',
            date: new Date().toISOString(),
            url: packageJson.url || '',
            company: packageJson.company,
            license: `Copyright (c)${new Date().getFullYear()} ${(packageJson.company || '')}`
        };

    return {
        banner,
        info
    };
}
