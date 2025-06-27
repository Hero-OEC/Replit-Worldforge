
module.exports = {
  packagerConfig: {
    name: 'InkAlchemy',
    executableName: 'inkalchemy',
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
        name: 'InkAlchemy'
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
