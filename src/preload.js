/* eslint-disable space-before-function-paren */
const fs = require('fs')
const path = require('node:path')

window.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('drop-area')

  // Prevent default drag behaviors
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })

  // Highlight/Area change on DragOver / DragLeave
  ;['dragenter', 'dragover'].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false)
  })
  ;['dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  // Handle dropped files
  dropArea.addEventListener('drop', handleDrop, false)

  async function handleDrop(e) {
    const dt = e.dataTransfer
    const files = dt.files

    splitJsonArray(files)
  }

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function highlight(e) {
    dropArea.style.background = '#ddd'
  }

  function unhighlight(e) {
    dropArea.style.background = 'none'
  }
})

const parseMultipleJson = (files) => {
  const multipleJson = []
  for (let index = 0; index < files.length; index++) {
    const bufferObj = fs.readFileSync(files[index].path)
    multipleJson.push(JSON.parse(bufferObj.toString()))
  }
  return multipleJson
}

const splitJsonArray = (files, limit = 5000) => {
  try {
    const source = parseMultipleJson(files)
    const flattedSource = source?.flat()

    const totalParts = Math.ceil(flattedSource.length / limit)
    for (let i = 0; i < totalParts; i++) {
      const partArray = flattedSource.slice(i * limit, (i + 1) * limit)?.flat()
      const partFileName = path.join(__dirname, `../output/part${i + 1}.json`)
      fs.writeFileSync(
        partFileName,
        JSON.stringify(partArray, null, 2),
        (err) => {
          if (err) {
            console.error(`Error writing file ${partFileName}:`, err)
          } else {
            console.log(`Successfully wrote ${partFileName}`)
          }
        }
      )
    }
  } catch (e) {
    console.error('Error parsing JSON:', e)
  }
}
