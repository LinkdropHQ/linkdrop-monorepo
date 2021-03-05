module.exports = shipit => {
  require('shipit-deploy')(shipit)

  const network = process.argv[2]
  const PM2_APP_NAME = `linkdrop-${network}`
  let CUSTOM_PORT

  if (network === 'mainnet') CUSTOM_PORT = 10001
  else if (network === 'rinkeby') CUSTOM_PORT = 10004
  else if (network === 'ropsten') CUSTOM_PORT = 10003
  else if (network === 'xdai') CUSTOM_PORT = 10100
  else if (network === 'kovan') CUSTOM_PORT = 10042

  shipit.initConfig({
    default: {
      repositoryUrl: 'git@github.com:LinkdropHQ/linkdrop-monorepo.git',
      keepReleases: 3,
      deployTo: `linkdrop/${network}`,
      servers: 'root@rinkeby.linkdrop.io'
    },
    rinkeby: { branch: 'dev' },
    ropsten: { branch: 'dev' },
    mainnet: { branch: 'dev' },
    xdai: { branch: 'dev' },
    kovan: { branch: 'dev' }    
  })

  shipit.blTask('installDependencies', async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && yarn cache clean && yarn install`
    )
    shipit.log('Installed yarn dependecies')
  })

  shipit.task('copyConfig', async () => {
    await shipit.copyToRemote(
      '../../../configs/server.config.json',
      `linkdrop/${network}/current/configs/server.config.json`
    )
  })

  shipit.task('compileContracts', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && yarn compile-contracts`)
  })

  shipit.blTask('stopApp', async () => {
    try {
      await shipit.remote(
        `cd ${shipit.releasePath} && pm2 stop ${PM2_APP_NAME} && pm2 delete ${PM2_APP_NAME}`
      )
      shipit.log('Stopped app process')
    } catch (err) {
      shipit.log('No previous process to restart. Continuing.')
    }
  })

  shipit.blTask('startApp', async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && CUSTOM_PORT=${CUSTOM_PORT} pm2 start --name ${PM2_APP_NAME} npm -- run server`
    )
    shipit.log('Started app process')
  })

  shipit.on('updated', () => {
    shipit.start(['installDependencies'])
  })

  shipit.on('published', () => {
    shipit.start(['copyConfig', 'compileContracts', 'stopApp', 'startApp'])
  })
}
