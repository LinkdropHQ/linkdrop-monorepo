/* eslint-disable no-undef */
import path from 'path'
import fs from 'fs'

const configPath = path.resolve(__dirname, './config.json')

// If config file does not exist, create it and fill with sample config content
if (!fs.existsSync(configPath)) {
  fs.copyFileSync(`${configPath}.sample`, configPath, err => {
    if (err) throw new Error(err)
  })
}

export default { ...require(configPath), path: configPath }
