
module.exports = {
  packagerConfig: {
    name: 'WorldForge',
    executableName: 'worldforge',
    icon: './assets/icon',
    ignore: [
      /^\/src/,
      /^\/server/,
      /^\/client/,
      /(.+).ts$/,
      /(.+).tsx$/,
      /node_modules/
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'WorldForge'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
};
