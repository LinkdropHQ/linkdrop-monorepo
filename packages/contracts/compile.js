const solc = require('solc')
const fs = require('fs')
const path = require('path')

const CONTRACT_FILE = 'Linkdrop.sol'

const content = fs.readFileSync(`./contracts/${CONTRACT_FILE}`).toString()

const config = {
  language: 'Solidity',
  sources: {
    [CONTRACT_FILE]: {
      content: content
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
      details: {
        yul: true
      }
    },
    evmVersion: 'istanbul',
    outputSelection: {
      '*': {
        '*': ['evm.bytecode.object']
      }
    }
  }
}

function getImports (dependency) {
  console.log('Searching for dependency: ', dependency)
  let contents

  if (fs.existsSync(path.resolve(__dirname, 'contracts', dependency))) {
    contents = fs.readFileSync(
      path.resolve(__dirname, 'contracts', dependency),
      'utf8'
    )
  } else if (
    fs.existsSync(path.resolve(__dirname, '../../node_modules', dependency))
  ) {
    contents = fs.readFileSync(
      path.resolve(__dirname, '../../node_modules', dependency),
      'utf8'
    )
  }

  if (contents) {
    return {
      contents
    }
  }
  return { error: 'Failed to fetch imports' }
}

function compileSources (config) {
  try {
    return JSON.parse(solc.compile(JSON.stringify(config), getImports))
  } catch (e) {
    console.log(e)
  }
}

const compiled = compileSources(config)

fs.writeFileSync(
  'output.json',
  JSON.stringify(compiled.contracts[CONTRACT_FILE]),
  'utf8',
  function (err) {
    if (err) {
      console.log('An error occured while writing JSON Object to File.')
      return console.log(err)
    }

    console.log('JSON file has been saved.')
  }
)
