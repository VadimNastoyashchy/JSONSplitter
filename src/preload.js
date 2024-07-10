/* eslint-disable space-before-function-paren */
const fs = require('fs')
const path = require('node:path')
const { exec } = require('child_process')

let filesToProcess = null

window.addEventListener('DOMContentLoaded', () => {
  const splitBtn = document.getElementById('splitBtn')
  const progressText = document.getElementById('progressBar')
  const deleteBtn = document.getElementById('deleteBtn')
  const fileNamesDiv = document.getElementById('fileNames')

  deleteBtn.addEventListener('click', async () => {
    deleteBtn.disabled = true
    progressText.innerText = 'Clearing...'
    filesToProcess = null
    fileNamesDiv.innerHTML = ''
    progressText.innerText = 'Clear!'
    deleteBtn.disabled = false
  })

  splitBtn.addEventListener('click', async () => {
    splitBtn.disabled = true
    progressText.innerText = 'Splitting in progress...'
    await splitJsonArray(filesToProcess) // Run the split operation
    progressText.innerText = 'Splitting complete!'
    splitBtn.disabled = false
  })
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

    // Add opened file names to list
    fileNamesDiv.innerHTML = ''
    Array.from(files).forEach((file) => {
      let p = document.createElement('p')
      p.textContent = file.name
      fileNamesDiv.append(p)
    })

    filesToProcess = files
    splitBtn.disabled = false
    progressText.innerText = ''
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
  const outputDir = path.join(__dirname, '../output')
  switch (process.platform) {
    case 'win32':
      exec(`start "" "${outputDir}"`)
      break
    case 'darwin':
      exec(`open "${outputDir}"`)
      break
    default:
      exec(`xdg-open "${outputDir}"`)
  }
}
